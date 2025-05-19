import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Clock,
  Calendar,
  Plus,
  X,
  Edit2,
  Trash2,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Define day order for sorting
const dayOrder = {
  'Senin': 1,
  'Selasa': 2,
  'Rabu': 3,
  'Kamis': 4,
  'Jumat': 5,
  'Sabtu': 6,
  'Minggu': 7
};

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dayFilter, setDayFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    day_of_week: 'Senin',
    start_time: '06:00',
    end_time: '21:00',
    description: '',
    max_capacity: 20
  });

  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  }, []);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('training_schedules')
        .select('*, user_schedules(user_id)', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,day_of_week.ilike.%${searchTerm}%`);
      }

      if (dayFilter !== 'all') {
        query = query.eq('day_of_week', dayFilter);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count, error } = await query
        .range(from, to)
        .order('day_of_week', { ascending: true });

      if (error) throw error;

      // Sort schedules by day order
      const sortedData = (data || []).sort((a, b) => {
        const dayA = dayOrder[a.day_of_week] || 0;
        const dayB = dayOrder[b.day_of_week] || 0;
        return dayA - dayB;
      });

      setSchedules(sortedData);
      setTotalSchedules(count || 0);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      showNotification('error', 'Gagal mengambil data jadwal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, dayFilter, showNotification]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        day_of_week: formData.day_of_week
      };

      if (editingSchedule) {
        const { error } = await supabase
          .from('training_schedules')
          .update(data)
          .eq('id', editingSchedule.id);

        if (error) throw error;
        showNotification('success', 'Jadwal berhasil diperbarui');
      } else {
        const { error } = await supabase
          .from('training_schedules')
          .insert([data]);

        if (error) throw error;
        showNotification('success', 'Jadwal baru berhasil ditambahkan');
      }

      setShowAddModal(false);
      setEditingSchedule(null);
      setFormData({
        day_of_week: 'Senin',
        start_time: '06:00',
        end_time: '21:00',
        description: '',
        max_capacity: 20
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      showNotification('error', 'Gagal menyimpan jadwal. Silakan coba lagi.');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time.slice(0, 5),
      end_time: schedule.end_time.slice(0, 5),
      description: schedule.description,
      max_capacity: schedule.max_capacity
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;

    try {
      setDeleting(true);

      // Start a transaction by using the RPC endpoint
      const { error: rpcError } = await supabase.rpc('delete_schedule', {
        schedule_id: id
      });

      if (rpcError) throw rpcError;

      // Update local state
      setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== id));
      showNotification('success', 'Jadwal berhasil dihapus');

      // Refresh the data to ensure sync
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      showNotification('error', 'Gagal menghapus jadwal. Silakan coba lagi.');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalSchedules / itemsPerPage);

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Jadwal Latihan</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola dan pantau jadwal latihan</p>
        </div>

        <button
          onClick={() => {
            setEditingSchedule(null);
            setFormData({
              day_of_week: 'Senin',
              start_time: '06:00',
              end_time: '21:00',
              description: '',
              max_capacity: 20
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Jadwal
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari jadwal..."
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
              value={dayFilter}
              onChange={(e) => {
                setDayFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Hari</option>
              {Object.keys(dayOrder).map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Hari</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Waktu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Deskripsi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Kapasitas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Terdaftar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black dark:text-white">Aksi</th>
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
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada jadwal ditemukan
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-black dark:text-white">
                          {schedule.day_of_week}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-black dark:text-white">
                          {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-black dark:text-white">
                        {schedule.description || 'Tidak ada deskripsi'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-black dark:text-white">
                        {schedule.max_capacity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-black dark:text-white">
                          {schedule.user_schedules?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
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
        Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalSchedules)} hingga {Math.min(currentPage * itemsPerPage, totalSchedules)} dari {totalSchedules} hasil
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSchedule(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hari
                </label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(dayOrder).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan deskripsi jadwal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kapasitas Maksimal
                </label>
                <input
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSchedule(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-colors"
                >
                  {editingSchedule ? 'Perbarui Jadwal' : 'Tambah Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;