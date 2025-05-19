import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { createClient } from '@supabase/supabase-js';
import ProfileImage from './ProfileImage';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Navbar = () => {
  const navigate = useNavigate();
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchProfile(user.id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://lh3.googleusercontent.com/pw/AP1GczODGd0Msd4ofSgH5yg1XV2aHsjktLhahNFMZ09WEE0VK_PIbJd0veuj8ozP6ixpXU5UY8PxhWqQR5xTe6TMukjFNcwmnNOl3HV61a38aQm4et9AYFgSnnCYyzfw0VH6OyDl_4PylBfVqux6qqNThKL_=w1181-h1039-s-no-gm?authuser=0" alt="SASANA PASEH" className="w-12 h-12" />
            <span className="text-xl font-bold">YAYASAN PASEH BERKARYA BOXING</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity">Beranda</Link>
            <Link to="/registration" className="hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity">Pendaftaran</Link>
            
            {/* Team Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
                onMouseEnter={() => setIsTeamMenuOpen(true)}
              >
                <span>Tim</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isTeamMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                  onMouseEnter={() => setIsTeamMenuOpen(true)}
                  onMouseLeave={() => setIsTeamMenuOpen(false)}
                >
                  <Link 
                    to="/officials" 
                    className="block px-4 py-2 text-sm hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black transition"
                    onClick={() => setIsTeamMenuOpen(false)}
                  >
                    Official
                  </Link>
                  <Link 
                    to="/coaches" 
                    className="block px-4 py-2 text-sm hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black transition"
                    onClick={() => setIsTeamMenuOpen(false)}
                  >
                    Pelatih
                  </Link>
                  <Link 
                    to="/athletes" 
                    className="block px-4 py-2 text-sm hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black transition"
                    onClick={() => setIsTeamMenuOpen(false)}
                  >
                    Atlet
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/gallery" className="hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity">Dokumentasi</Link>
            <Link to="/merchandise" className="hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity">Merchandise</Link>
            <Link to="/about" className="hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity">Tentang</Link>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                  >
                    <ProfileImage
                      src={profile?.profile_photo}
                      size="sm"
                      alt={profile?.full_name || 'Profile'}
                    />
                    <span>{profile?.full_name || 'Profile'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black transition"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black transition"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black transition"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-md bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 rounded-md bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 dark:text-white hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <Link 
              to="/" 
              className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="/registration" 
              className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pendaftaran
            </Link>
            <div className="py-2">
              <button 
                className="flex items-center hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
              >
                <span>Tim</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {isTeamMenuOpen && (
                <div className="pl-4 mt-2">
                  <Link 
                    to="/officials" 
                    className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setIsTeamMenuOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Official
                  </Link>
                  <Link 
                    to="/coaches" 
                    className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setIsTeamMenuOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Pelatih
                  </Link>
                  <Link 
                    to="/athletes" 
                    className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setIsTeamMenuOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Atlet
                  </Link>
                </div>
              )}
            </div>
            <Link 
              to="/gallery" 
              className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galeri
            </Link>
            <Link 
              to="/merchandise" 
              className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Merchandise
            </Link>
            <Link 
              to="/about" 
              className="block py-2 hover:bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang
            </Link>
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-center rounded-md bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-center rounded-md bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-center rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-center rounded-md bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 hover:opacity-90 transition-opacity text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-2 text-center rounded-md bg-red-600 text-white hover:bg-red-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
