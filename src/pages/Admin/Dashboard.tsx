import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Search,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    todayAttendance: 0,
    weeklyGrowth: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Filter activities when search term changes
    const filtered = recentActivities.filter(activity =>
      activity.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.institution && activity.institution.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredActivities(filtered);
  }, [searchTerm, recentActivities]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Fetch active users (users who have logged in within the last 7 days)
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch today's attendance
      const { count: todayAttendance } = await supabase
        .from('user_schedules')
        .select('*', { count: 'exact' })
        .gte('created_at', new Date().toISOString().split('T')[0]);

      // Calculate weekly growth
      const previousWeekUsers = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .lte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const weeklyGrowth = totalUsers && previousWeekUsers.count
        ? ((totalUsers - previousWeekUsers.count) / previousWeekUsers.count) * 100
        : 0;

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        todayAttendance: todayAttendance || 0,
        weeklyGrowth
      });

      // Fetch recent activities
      const { data: activities } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivities(activities || []);
      setFilteredActivities(activities || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, description, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-black dark:text-white mb-2">{value}</p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Beranda Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Selamat datang di halaman utama admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Pengguna"
          value={stats.totalUsers}
          description="Jumlah pengguna terdaftar"
          trend={stats.weeklyGrowth}
        />
        <StatCard
          icon={Activity}
          title="Pengguna Aktif"
          value={stats.activeUsers}
          description="Aktif dalam 7 hari terakhir"
        />
        <StatCard
          icon={Calendar}
          title="Kehadiran Hari Ini"
          value={stats.todayAttendance}
          description="Pengguna hadir hari ini"
        />
        <StatCard
          icon={TrendingUp}
          title="Perkembangan Mingguan"
          value={`${stats.weeklyGrowth.toFixed(1)}%`}
          description="Pertumbuhan pengguna minggu ini"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white">Aktivitas Terkini</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama pengguna..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-black dark:text-white">{activity.full_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.role} - {activity.institution || 'Tidak ada institusi'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-black dark:text-white">
                  {format(new Date(activity.created_at), 'dd MMM yyyy')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(activity.created_at), 'HH:mm')}
                </p>
              </div>
            </div>
          ))}
          
          {filteredActivities.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Tidak ada aktivitas yang ditemukan
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;