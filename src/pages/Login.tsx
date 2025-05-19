import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-black/80 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-500">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <img 
                src="https://lh3.googleusercontent.com/pw/AP1GczODGd0Msd4ofSgH5yg1XV2aHsjktLhahNFMZ09WEE0VK_PIbJd0veuj8ozP6ixpXU5UY8PxhWqQR5xTe6TMukjFNcwmnNOl3HV61a38aQm4et9AYFgSnnCYyzfw0VH6OyDl_4PylBfVqux6qqNThKL_=w1181-h1039-s-no-gm?authuser=0" 
                alt="Logo Sasana Paseh" 
                className="w-24 h-24 object-contain transform hover:scale-110 transition-all duration-500"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-black dark:text-white mb-2">Selamat Datang Kembali!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Belum punya akun?{' '}
              <Link to="/register" className="font-medium text-black dark:text-white hover:opacity-80 transition-opacity duration-300">
                Daftar
              </Link>
            </p>
          </div>
          
          {successMessage && (
            <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 p-3 rounded-lg mb-4 text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6 animate-fade-in">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                  placeholder="Masukkan email anda"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kata Sandi
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                  placeholder="Masukkan kata sandi"
                />
              </div>
            </div>

            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-black dark:text-white hover:opacity-80 transition-opacity duration-300">
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            <div className="animate-fade-in">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black dark:text-white bg-gradient-to-br from-green-500/20 via-blue-500/10 to-teal-500/20 dark:from-green-400/30 dark:via-blue-400/20 dark:to-teal-400/30 hover:from-green-600/30 hover:via-blue-600/20 hover:to-teal-600/30 dark:hover:from-green-500/40 dark:hover:via-blue-500/30 dark:hover:to-teal-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-teal-300 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;