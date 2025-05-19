import React, { useState, useEffect } from 'react';
import { Search, Medal, ChevronLeft, ChevronRight, Calendar, Phone, Instagram } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ProfileImage from '../components/ProfileImage';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalAthletes, setTotalAthletes] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAthletes();
  }, [currentPage, searchTerm]);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      
      // Create base query
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'athlete')
        .order('created_at', { ascending: false });

      // Add search if term exists
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,institution.ilike.%${searchTerm}%`);
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, count, error } = await query
        .range(from, to);

      if (error) throw error;

      setAthletes(data || []);
      setTotalAthletes(count || 0);
    } catch (error) {
      console.error('Error fetching athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalAthletes / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-20">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 animate-fade-in">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari atlet..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full px-4 py-3 pl-12 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Athletes Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Nama</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Institusi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Tinggi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Berat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Kontak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Prestasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
                      </div>
                    </td>
                  </tr>
                ) : athletes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Tidak ada atlet yang ditemukan
                    </td>
                  </tr>
                ) : (
                  athletes.map((athlete) => (
                    <tr 
                      key={athlete.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProfileImage
                            src={athlete.profile_photo}
                            size="md"
                            alt={athlete.full_name}
                          />
                          <div>
                            <div className="font-medium text-black dark:text-white">{athlete.full_name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(athlete.created_at).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-black dark:text-white">{athlete.institution || '-'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{athlete.occupation || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-black dark:text-white">
                          {athlete.height ? <span className="flex items-center">{athlete.height} cm</span> : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-black dark:text-white">
                          {athlete.weight ? <span className="flex items-center">{athlete.weight} kg</span> : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {athlete.whatsapp && (
                            <div className="flex items-center gap-2 text-black dark:text-white">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {athlete.whatsapp}
                            </div>
                          )}
                          {athlete.instagram && (
                            <div className="flex items-center gap-2 text-black dark:text-white">
                              <Instagram className="w-4 h-4 text-gray-400" />
                              {athlete.instagram}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {athlete.achievements?.map((achievement, index) => (
                            <span
                              key={index}
className="inline-flex items-center px-2 py-1 bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-gray-100 text-xs rounded-full"
                            >
                              <Medal className="w-3 h-3 mr-1" />
                              {achievement.title}
                            </span>
                          ))}
                          {(!athlete.achievements || athlete.achievements.length === 0) && (
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 animate-fade-in">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white disabled:opacity-50 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {getPageNumbers().map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                currentPage === number
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white disabled:opacity-50 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Results Count */}
        <div className="text-center mt-6 text-black/60 dark:text-white/60 animate-fade-in">
          Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalAthletes)} hingga {Math.min(currentPage * itemsPerPage, totalAthletes)} dari {totalAthletes} hasil
        </div>
      </div>
    </div>
  );
};

export default Athletes;
