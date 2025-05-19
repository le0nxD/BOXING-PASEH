import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              role: 'athlete',
            },
          ]);

        if (profileError) throw profileError;

        // Sign out the user after successful registration
        await supabase.auth.signOut();
        
        // Redirect to login page with success message
        navigate('/login', { 
          state: { 
            message: ' Registrasi berhasil! Silakan masuk dengan akun baru Anda.' 
          }
        });
      }
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
            <h2 className="text-3xl font-extrabold text-black dark:text-white mb-2">Bergabung dengan Komunitas Kami</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-medium text-black dark:text-white hover:opacity-80 transition-opacity duration-300">
                Masuk
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Lengkap
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                  placeholder="Masukkan nama lengkap anda"
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                  placeholder="Masukkan email anda"
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kata Sandi
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                  placeholder="Buat kata sandi"
                />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-300"
                  placeholder="Konfirmasi kata sandi anda"
                />
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black dark:text-white bg-gradient-to-br from-green-500/20 via-blue-500/10 to-teal-500/20 dark:from-green-400/30 dark:via-blue-400/20 dark:to-teal-400/30 hover:from-green-600/30 hover:via-blue-600/20 hover:to-teal-600/30 dark:hover:from-green-500/40 dark:hover:via-blue-500/30 dark:hover:to-teal-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-teal-300 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Buat Akun'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;