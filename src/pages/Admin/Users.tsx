import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  Edit2,
  Trash2,
  Award,
  User,
  Phone,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import ProfileImage from '../../components/ProfileImage';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Map English days to Indonesian
const dayTranslations = {
  'Monday': 'Senin',
  'Tuesday': 'Selasa',
  'Wednesday': 'Rabu',
  'Thursday': 'Kamis',
  'Friday': 'Jumat',
  'Saturday': 'Sabtu',
  'Sunday': 'Minggu'
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*, user_schedules(training_schedules(day_of_week))', { count: 'exact' });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,institution.ilike.%${searchTerm}%,whatsapp.ilike.%${searchTerm}%`);
      }

      // Apply role filter
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      // Add pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setUsers(data || []);
      setTotalUsers(count || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    try {
      setDeleting(true);

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      // Call the Edge Function to delete the user
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      setShowUserModal(false);
      
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Gagal menghapus pengguna. Silakan coba lagi.');
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Gagal mengubah peran pengguna. Silakan coba lagi.');
    }
  };

    const exportUsers = () => {
    let table = `
      <table border="1">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>WhatsApp</th>
            <th>Instagram</th>
            <th>Institution</th>
            <th>Address</th>
            <th>Birth Date</th>
            <th>Training Days</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
    `;

    users.forEach(user => {
      table += `
        <tr>
          <td>${user.full_name || '-'}</td>
          <td>${user.role || '-'}</td>
          <td>${user.email || '-'}</td>
          <td>${user.whatsapp || '-'}</td>
          <td>${user.instagram || '-'}</td>
          <td>${user.institution || '-'}</td>
          <td>${user.address || '-'}</td>
          <td>${user.birth_date ? new Date(user.birth_date).toLocaleDateString('id-ID') : '-'}</td>
          <td>${getUserTrainingDays(user) || '-'}</td>
          <td>${new Date(user.created_at).toLocaleDateString('id-ID')}</td>
        </tr>
      `;
    });

    table += `
        </tbody>
      </table>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Data</title>
      </head>
      <body>
        ${table}
      </body>
      </html>
    `;

    const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", "users.html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Function to escape CSV fields
  const escapeCsvField = (field) => {
    if (field === null || field === undefined) {
      return '';
    }
    let escapedField = String(field).replace(/"/g, '""');
    if (escapedField.includes(',') || escapedField.includes('"') || escapedField.includes('\n')) {
      escapedField = `"${escapedField}"`;
    }
    return escapedField;
  };


  const totalPages = Math.ceil(totalUsers / itemsPerPage);

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

   const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
  };

  const getTrainingLocationText = (user) => {
    if (user?.training_location === 'sasana') return 'Latihan di Sasana';
    if (user?.training_location === 'private') return 'Latihan Privat';
    return '-';
  };

  const getGenderText = (user) => {
    if (user?.gender === 'male') return 'Laki-Laki';
    if (user?.gender === 'female') return 'Perempuan';
    return '-';
  };

  const getAchievementsText = (user) => {
    if (!user?.achievements || user?.achievements.length === 0) return '-';
    return user.achievements.map(achievement => `${achievement.title} (${achievement.year})`).join(', ');
  };

  const getUserTrainingDays = (user) => {
    if (!user.user_schedules || user.user_schedules.length === 0) {
      return '-';
    }

    const days = user.user_schedules.map(schedule => {
      const dayOfWeek = schedule.training_schedules?.day_of_week || '';
      return dayTranslations[dayOfWeek] || dayOfWeek; // Translate to Indonesian
    });

    return days.join(', ');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Manajemen Pengguna</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola dan pantau akun pengguna</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={exportUsers}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Unduh Data Pengguna
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Peran</option>
              <option value="athlete">Atlet</option>
              <option value="coach">Pelatih</option>
              <option value="admin">Admin</option>
            </select>

          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Pengguna</th>
                <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Kontak</th>
                <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Tinggi</th>
                <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Berat</th>
                <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Institusi</th>
                 <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Lokasi</th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Gender</th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Lahir</th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Prestasi</th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Jadwal Latihan</th>
                <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Alamat</th>
                <th className="px-6 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada pengguna ditemukan
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="flex items-center gap-3">
                        <ProfileImage
                          src={user.profile_photo}
                          size="md"
                          alt={user.full_name}
                        />
                        <div>
                          <div className="font-medium text-black dark:text-white">{user.full_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="space-y-1">
                        {user.whatsapp && (
                          <div className="flex items-center gap-2 text-black dark:text-white">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.whatsapp}
                          </div>
                        )}
                        {user.instagram && (
                          <div className="flex items-center gap-2 text-black dark:text-white">
                            <Instagram className="w-4 h-4 text-gray-400" />
                            {user.instagram}
                          </div>
                        )}
                      </div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                        {user.height ?  `${user.height} cm` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div  className="text-black dark:text-white">
                        {user.weight ? `${user.weight} kg` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                        {user.institution || '-'}
                      </div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                        {getTrainingLocationText(user)}
                      </div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                        {getGenderText(user)}
                      </div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                       {formatDate(user.birth_date)}
                      </div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                        {getAchievementsText(user)}
                      </div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                        {getUserTrainingDays(user)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="text-black dark:text-white">
                        {user.address || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="athlete">Atlet</option>
                          <option value="coach">Pelatih</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleting}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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
      <div className="flex justify-center items-center gap-2">
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
      <div className="text-center mt-6 text-black/60 dark:text-white/60">
        Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalUsers)} hingga {Math.min(currentPage * itemsPerPage, totalUsers)} dari {totalUsers} hasil
      </div>
    </div>
  );
};

export default Users;
