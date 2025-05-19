import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { sanitize } from 'npm:sanitize-html@2.12.1';
import { validate } from 'npm:validator@13.11.0';
import { filterXSS } from 'npm:xss@1.0.15';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  'Access-Control-Max-Age': '86400',
};

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.supabase.com",
  'X-DNS-Prefetch-Control': 'off',
  'Expect-CT': 'max-age=86400, enforce',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Download-Options': 'noopen',
  'X-Content-Type-Options': 'nosniff',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Referrer-Policy': 'same-origin',
  'X-XSS-Protection': '1; mode=block',
};

const config = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
  security: {
    trustedProxies: ['127.0.0.1'],
    requestSizeLimit: 10 * 1024 * 1024, // 10MB
  },
  validation: {
    maxStringLength: 1000,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
};

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

class InputValidator {
  static sanitizeString(input: string): string {
    return filterXSS(sanitize(input));
  }

  static validateEmail(email: string): boolean {
    return validate.isEmail(email);
  }

  static validateURL(url: string): boolean {
    return validate.isURL(url, { protocols: ['http', 'https'] });
  }

  static validateFileUpload(contentType: string, size: number): boolean {
    return (
      config.validation.allowedFileTypes.includes(contentType) &&
      size <= config.validation.maxFileSize
    );
  }
}

const handleError = (error: Error | SecurityError): Response => {
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(7);

  console.error('Security violation:', {
    id: errorId,
    timestamp,
    name: error.name,
    message: error.message,
  });

  return new Response(
    JSON.stringify({
      error: Deno.env.get('SUPABASE_ENV') === 'production' 
        ? 'An error occurred' 
        : error.message,
      errorId,
      timestamp,
    }),
    {
      status: error instanceof SecurityError ? error.statusCode : 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
};

// Rate limiting implementation using in-memory store (for demo purposes)
// In production, use Redis or a similar distributed store
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimiter.get(ip);

  if (!record || now > record.resetTime) {
    rateLimiter.set(ip, {
      count: 1,
      resetTime: now + config.rateLimit.windowMs,
    });
    return true;
  }

  if (record.count >= config.rateLimit.max) {
    return false;
  }

  record.count++;
  return true;
};

// Main security middleware
const securityMiddleware = async (req: Request): Promise<Response | Request> => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: { ...corsHeaders, ...securityHeaders },
      });
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!config.security.trustedProxies.includes(clientIP)) {
      if (!checkRateLimit(clientIP)) {
        throw new SecurityError('Too many requests', 429);
      }
    }

    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (error || !user) {
        throw new SecurityError('Invalid authentication token', 401);
      }
    }

    // Validate and sanitize request body
    if (req.body) {
      const contentType = req.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const body = await req.json();
        const sanitizedBody = Object.entries(body).reduce((acc, [key, value]) => {
          if (typeof value === 'string') {
            acc[key] = InputValidator.sanitizeString(value);
            
            if (key === 'email' && !InputValidator.validateEmail(value)) {
              throw new SecurityError('Invalid email format');
            }
            if (key === 'url' && !InputValidator.validateURL(value)) {
              throw new SecurityError('Invalid URL format');
            }
          } else {
            acc[key] = value;
          }
          return acc;
        }, {});

        return new Request(req.url, {
          method: req.method,
          headers: new Headers({
            ...Object.fromEntries(req.headers.entries()),
            ...securityHeaders,
          }),
          body: JSON.stringify(sanitizedBody),
        });
      }
    }

    // Add security headers to request
    return new Request(req.url, {
      method: req.method,
      headers: new Headers({
        ...Object.fromEntries(req.headers.entries()),
        ...securityHeaders,
      }),
      body: req.body,
    });
  } catch (error) {
    return handleError(error);
  }
};

// Main serve function
Deno.serve(async (req) => {
  try {
    const secureRequest = await securityMiddleware(req);
    if (secureRequest instanceof Response) {
      return secureRequest;
    }

    // Example route handler
    const url = new URL(req.url);
    switch (url.pathname) {
      case '/api/test':
        return new Response(
          JSON.stringify({ message: 'Secure endpoint working!' }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders,
            },
          }
        );
      
      default:
        return new Response(
          JSON.stringify({ error: 'Not found' }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders,
            },
          }
        );
    }
  } catch (error) {
    return handleError(error);
  }
});