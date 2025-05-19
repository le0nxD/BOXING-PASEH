import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import sanitizeHtml from 'sanitize-html';
import SQL from 'sql-template-strings';
import Tokens from 'csrf';
import validator from 'validator';
import xss from 'xss';

// Initialize security tools
const tokens = new Tokens();
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Security configuration
const config = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    statusCode: 429,
    headers: true,
  },
  cors: {
    allowedOrigins: ['http://localhost:5173', 'https://your-production-domain.com'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400,
  },
  csrf: {
    secret: process.env.CSRF_SECRET || 'your-csrf-secret',
    cookieName: 'csrf-token',
    headerName: 'X-CSRF-Token',
  },
  security: {
    requestSizeLimit: '10mb',
    rateLimitBypassToken: process.env.RATE_LIMIT_BYPASS_TOKEN,
    trustedProxies: ['127.0.0.1'],
    sqlInjectionPatterns: [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
      /((\%27)|(\'))union/i,
    ],
  },
  validation: {
    maxStringLength: 1000,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    format: 'combined',
    file: 'security.log',
  },
};

// Input validation and sanitization
class InputValidator {
  static sanitizeString(input: string): string {
    return validator.escape(xss(sanitizeHtml(input)));
  }

  static validateEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  static validateURL(url: string): boolean {
    return validator.isURL(url, { protocols: ['http', 'https'] });
  }

  static sanitizeSQL(query: string): string {
    return SQL`${query}`.text;
  }

  static validateFileUpload(file: File): boolean {
    return (
      config.validation.allowedFileTypes.includes(file.type) &&
      file.size <= config.validation.maxFileSize
    );
  }
}

// Security headers configuration
const securityHeaders = {
  ...helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.supabase.com'],
      fontSrc: ["'self'", 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
  ...helmet.dnsPrefetchControl({ allow: false }),
  ...helmet.expectCt({
    maxAge: 86400,
    enforce: true,
  }),
  ...helmet.frameguard({ action: 'deny' }),
  ...helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  }),
  ...helmet.ieNoOpen(),
  ...helmet.noSniff(),
  ...helmet.permittedCrossDomainPolicies(),
  ...helmet.referrerPolicy({ policy: 'same-origin' }),
  ...helmet.xssFilter(),
};

// Rate limiting with IP whitelist
const rateLimiter = rateLimit({
  ...config.rateLimit,
  skip: (req) => {
    const bypassToken = req.headers.get('X-Rate-Limit-Bypass');
    return (
      config.security.trustedProxies.includes(req.headers.get('x-forwarded-for') || '') ||
      bypassToken === config.security.rateLimitBypassToken
    );
  },
});

// CSRF Protection
class CSRFProtection {
  static generateToken(): string {
    return tokens.create(config.csrf.secret);
  }

  static verifyToken(token: string): boolean {
    return tokens.verify(config.csrf.secret, token);
  }

  static setTokenCookie(res: Response): Response {
    const token = this.generateToken();
    return new Response(res.body, {
      ...res,
      headers: {
        ...res.headers,
        'Set-Cookie': `${config.csrf.cookieName}=${token}; HttpOnly; Secure; SameSite=Strict`,
      },
    });
  }
}

// Error handling with logging
class SecurityError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = 'SecurityError';
  }
}

const handleError = (error: Error | SecurityError): Response => {
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(7);

  // Log error details
  console.error('Security violation:', {
    id: errorId,
    timestamp,
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  // Return sanitized error response
  return new Response(
    JSON.stringify({
      error: process.env.NODE_ENV === 'production' 
        ? 'An error occurred' 
        : error.message,
      errorId,
      timestamp,
    }),
    {
      status: error instanceof SecurityError ? error.statusCode : 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

// Main security middleware
export const securityMiddleware = async (req: Request): Promise<Response | Request> => {
  try {
    // Apply CORS
    const origin = req.headers.get('Origin');
    if (origin && !config.cors.allowedOrigins.includes(origin)) {
      throw new SecurityError('Origin not allowed', 403);
    }

    // Apply rate limiting
    await rateLimiter(req);

    // Verify CSRF token for non-GET requests
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const csrfToken = req.headers.get(config.csrf.headerName);
      if (!csrfToken || !CSRFProtection.verifyToken(csrfToken)) {
        throw new SecurityError('Invalid CSRF token', 403);
      }
    }

    // Authenticate request
    const authHeader = req.headers.get('Authorization');
    if (req.url.includes('/api/')) {
      if (!authHeader?.startsWith('Bearer ')) {
        throw new SecurityError('Unauthorized', 401);
      }

      const { data: { user }, error } = await supabase.auth.getUser(
        authHeader.split(' ')[1]
      );

      if (error || !user) {
        throw new SecurityError('Invalid authentication token', 401);
      }
    }

    // Validate and sanitize request body
    if (req.body) {
      const body = await req.json();
      const sanitizedBody = Object.entries(body).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = InputValidator.sanitizeString(value);
          
          // Additional validation based on field type
          if (key === 'email' && !InputValidator.validateEmail(value as string)) {
            throw new SecurityError('Invalid email format');
          }
          if (key === 'url' && !InputValidator.validateURL(value as string)) {
            throw new SecurityError('Invalid URL format');
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Create new request with sanitized body
      return new Request(req.url, {
        method: req.method,
        headers: new Headers({
          ...Object.fromEntries(req.headers.entries()),
          ...securityHeaders,
        }),
        body: JSON.stringify(sanitizedBody),
      });
    }

    // Add security headers to request
    return new Request(req.url, {
      method: req.method,
      headers: new Headers({
        ...Object.fromEntries(req.headers.entries()),
        ...securityHeaders,
      }),
    });
  } catch (error) {
    return handleError(error);
  }
};

// Export utilities and configuration
export {
  InputValidator,
  CSRFProtection,
  SecurityError,
  config as securityConfig,
};