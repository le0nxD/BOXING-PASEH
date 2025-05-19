import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Award, Plus, X, Save, Edit3, User, MapPin, Phone, Instagram, Calendar, Building2, Ruler, Weight, Clock, Venus, Mars } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Map English days to Indonesian and define day order
const dayTranslations = {
  'Monday': 'Senin',
  'Tuesday': 'Selasa',
  'Wednesday': 'Rabu',
  'Thursday': 'Kamis',
  'Friday': 'Jumat',
  'Saturday': 'Sabtu',
  'Sunday': 'Minggu'
};

// Define day order for sorting
const dayOrder = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
  'Sunday': 7
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ title: '', year: '' });
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchUserSchedules();
  }, []);

  const fetchProfile = async () => {
    try {
      setError(null);
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!authUser) {
        navigate('/login');
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            full_name: authUser.email?.split('@')[0] || 'Pengguna Baru',
            role: 'athlete',
            achievements: []
          })
          .select()
          .single();

        if (createError) throw createError;
        setUser(newProfile);
      } else if (profileError) {
        throw profileError;
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSchedules = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('user_schedules')
        .select(`
          schedule_id,
          training_schedules (
            day_of_week,
            start_time,
            end_time,
            description
          )
        `)
        .eq('user_id', authUser.id)
        .eq('status', 'active');

      if (error) throw error;

      // Sort schedules by day of week
      const sortedSchedules = (data || []).sort((a, b) => {
        const dayA = dayOrder[a.training_schedules.day_of_week] || 0;
        const dayB = dayOrder[b.training_schedules.day_of_week] || 0;
        return dayA - dayB;
      });

      setSchedules(sortedSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData = {
        full_name: user.full_name,
        role: user.role,
        gender: user.gender,
        occupation: user.occupation,
        institution: user.institution,
        birth_date: user.birth_date,
        height: user.height,
        weight: user.weight,
        whatsapp: user.whatsapp,
        instagram: user.instagram,
        address: user.address,
        training_location: user.training_location,
        achievements: user.achievements,
        profile_photo: user.profile_photo
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.year) return;

    try {
      const updatedAchievements = [...(user.achievements || []), newAchievement];
      const { error } = await supabase
        .from('profiles')
        .update({ achievements: updatedAchievements })
        .eq('id', user.id);

      if (error) throw error;
      setUser({ ...user, achievements: updatedAchievements });
      setNewAchievement({ title: '', year: '' });
      setShowAchievementForm(false);
    } catch (error) {
      console.error('Error adding achievement:', error);
      setError(error.message);
    }
  };

  const handleRemoveAchievement = async (index) => {
    try {
      const updatedAchievements = user.achievements.filter((_, i) => i !== index);
      const { error } = await supabase
        .from('profiles')
        .update({ achievements: updatedAchievements })
        .eq('id', user.id);

      if (error) throw error;
      setUser({ ...user, achievements: updatedAchievements });
    } catch (error) {
      console.error('Error removing achievement:', error);
      setError(error.message);
    }
  };

  const handlePhotoUpdate = (url: string) => {
    setUser(prev => ({ ...prev, profile_photo: url }));
  };

  const getGenderIcon = () => {
    if (user?.gender === 'male') return <Mars className="w-5 h-5" />;
    if (user?.gender === 'female') return <Venus className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  const getGenderText = () => {
    if (user?.gender === 'male') return 'Laki-laki';
    if (user?.gender === 'female') return 'Perempuan';
    return 'Belum ditentukan';
  };

  const getTrainingLocationText = () => {
    if (user?.training_location === 'sasana') return 'Latihan di Sasana';
    if (user?.training_location === 'private') return 'Latihan Privat';
    return 'Belum ditentukan';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Memuat Profil</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profil Tidak Ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Tidak dapat memuat profil Anda. Silakan masuk kembali.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Masuk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="relative h-48 bg-[linear-gradient(to_bottom,_#dc2626_50%,_white_50%)]">
              <div className="absolute -bottom-16 left-8">
                <ProfilePhotoUpload
                  userId={user.id}
                  currentPhotoUrl={user.profile_photo}
                  onPhotoUpdate={handlePhotoUpdate}
                />
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit Profil</span>
                </button>
              </div>
            </div>
            
            <div className="pt-20 px-8 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                    {user.full_name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium capitalize">
                      {user.role === 'athlete' ? 'Atlet' : user.role === 'coach' ? 'Pelatih' : 'Admin'}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium flex items-center gap-1">
                      {getGenderIcon()}
                      {getGenderText()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Informasi Pribadi</h2>
                
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={user.full_name}
                          onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pekerjaan
                        </label>
                        <input
                          type="text"
                          value={user.occupation}
                          onChange={(e) => setUser({ ...user, occupation: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Institusi
                        </label>
                        <input
                          type="text"
                          value={user.institution}
                          onChange={(e) => setUser({ ...user, institution: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          value={user.birth_date}
                          onChange={(e) => setUser({ ...user, birth_date: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tinggi Badan (cm)
                        </label>
                        <input
                          type="number"
                          value={user.height}
                          onChange={(e) => setUser({ ...user, height: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Berat Badan (kg)
                        </label>
                        <input
                          type="number"
                          value={user.weight}
                          onChange={(e) => setUser({ ...user, weight: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          WhatsApp
                        </label>
                        <input
                          type="text"
                          value={user.whatsapp}
                          onChange={(e) => setUser({ ...user, whatsapp: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Instagram
                        </label>
                        <input
                          type="text"
                          value={user.instagram}
                          onChange={(e) => setUser({ ...user, instagram: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Alamat
                      </label>
                      <textarea
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white dark:border-black"></div>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                        <p className="text-black dark:text-white">{user.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pekerjaan</p>
                        <p className="text-black dark:text-white">{user.occupation || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Institusi</p>
                        <p className="text-black dark:text-white">{user.institution || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Lahir</p>
                        <p className="text-black dark:text-white">
                          {user.birth_date ? new Date(user.birth_date).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tinggi Badan</p>
                        <p className="text-black dark:text-white">{user.height ? `${user.height} cm` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Berat Badan</p>
                        <p className="text-black dark:text-white">{user.weight ? `${user.weight} kg` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                        <p className="text-black dark:text-white">{user.whatsapp || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Instagram</p>
                        <p className="text-black dark:text-white">{user.instagram || '-'}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Alamat</p>
                      <p className="text-black dark:text-white">{user.address || '-'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Training Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-6">Informasi Latihan</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Lokasi Latihan</p>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <p className="text-black dark:text-white font-medium">{getTrainingLocationText()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Jadwal Latihan</p>
                    <div className="space-y-2">
                      {schedules.map((schedule) => (
                        <div
                          key={schedule.schedule_id}
                          className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="text-black dark:text-white font-medium">
                              {dayTranslations[schedule.training_schedules.day_of_week] || schedule.training_schedules.day_of_week}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {schedule.training_schedules.start_time.slice(0, 5)} - {schedule.training_schedules.end_time.slice(0, 5)}
                            </p>
                          </div>
                          <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      ))}
                      {schedules.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          Belum ada jadwal latihan yang dipilih
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-black dark:text-white">Prestasi</h2>
                  <button
                    onClick={() => setShowAchievementForm(true)}
                    className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {showAchievementForm && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Judul Prestasi
                        </label>
                        <input
                          type="text"
                          value={newAchievement.title}
                          onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 text-black dark:text-white border border-gray-200 dark:border-gray-500"
                          placeholder="Masukkan judul prestasi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tahun
                        </label>
                        <input
                          type="text"
                          value={newAchievement.year}
                          onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 text-black dark:text-white border border-gray-200 dark:border-gray-500"
                          placeholder="Masukkan tahun"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowAchievementForm(false)}
                          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleAddAchievement}
                          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {user.achievements?.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-black dark:text-white">{achievement.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.year}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAchievement(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  {(!user.achievements || user.achievements.length === 0) && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      Belum ada prestasi yang ditambahkan
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
