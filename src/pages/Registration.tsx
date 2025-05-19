import React, { useState, useEffect } from 'react';
import { Calendar, User, School, MapPin, Phone, Instagram, Clock, Building, Weight, PersonStanding as Height, Venus, Mars } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

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

// Map English descriptions to Indonesian
const descriptionTranslations = {
  'Weekday training session': 'Jadwal latihan weekdays',
  'Weekend training session': 'Jadwal latihan weekends'
};

const Registration = () => {
  const navigate = useNavigate();
  const [occupationType, setOccupationType] = useState('student');
  const [gender, setGender] = useState('');
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [trainingSchedules, setTrainingSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    occupation: 'student',
    institution: '',
    birthDate: '',
    height: '',
    weight: '',
    whatsApp: '',
    instagram: '',
    address: '',
    trainingLocation: 'sasana'
  });

  useEffect(() => {
    fetchTrainingSchedules();
  }, []);

  const fetchTrainingSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('training_schedules')
        .select('*')
        .order('day_of_week');
      
      if (error) throw error;
      
      // Transform the data to use Indonesian day names and descriptions
      const transformedData = data.map(schedule => ({
        ...schedule,
        day_of_week: dayTranslations[schedule.day_of_week] || schedule.day_of_week,
        description: descriptionTranslations[schedule.description] || schedule.description
      }));
      
      setTrainingSchedules(transformedData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSchedule = (scheduleId) => {
    setSelectedSchedules(prev => {
      if (prev.includes(scheduleId)) {
        return prev.filter(id => id !== scheduleId);
      }
      return [...prev, scheduleId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!authUser) {
        navigate('/login');
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: authUser.id,
            full_name: formData.fullName,
            gender,
            occupation: formData.occupation,
            institution: formData.institution,
            birth_date: formData.birthDate,
            height: parseInt(formData.height),
            weight: parseInt(formData.weight),
            whatsapp: formData.whatsApp,
            instagram: formData.instagram,
            address: formData.address,
            training_location: formData.trainingLocation,
            role: 'athlete'
          }
        ]);

      if (profileError) throw profileError;

      // Create user schedules
      const schedulePromises = selectedSchedules.map(scheduleId => 
        supabase
          .from('user_schedules')
          .insert([
            {
              user_id: authUser.id,
              schedule_id: scheduleId
            }
          ])
      );

      await Promise.all(schedulePromises);

      // Redirect to profile
      navigate('/profile');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const schedulesByDay = trainingSchedules.reduce((acc, schedule) => {
    const day = schedule.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(schedule);
    return acc;
  }, {});

  // Sort days according to Indonesian week order
  const sortedDays = Object.keys(schedulesByDay).sort((a, b) => {
    const dayOrder = {
      'Senin': 1,
      'Selasa': 2,
      'Rabu': 3,
      'Kamis': 4,
      'Jumat': 5,
      'Sabtu': 6,
      'Minggu': 7
    };
    return dayOrder[a] - dayOrder[b];
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
            Bergabung dengan Sasana Paseh
          </h1>
          <p className="text-lg text-black/80 dark:text-white/80 max-w-2xl mx-auto">
            Mulai perjalanan Anda menuju kesuksesan dengan program pelatihan profesional kami
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-8 flex items-center">
                <User className="w-8 h-8 mr-3" />
                Formulir Pendaftaran
              </h2>

              {/* Personal Information */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-6 border border-gray-200 dark:border-gray-800 transform hover:scale-[1.01] transition-transform duration-300 mb-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Informasi Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <User className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      {gender === 'male' ? (
                        <Mars className="w-5 h-5 mr-2 text-black dark:text-white" />
                      ) : gender === 'female' ? (
                        <Venus className="w-5 h-5 mr-2 text-black dark:text-white" />
                      ) : (
                        <User className="w-5 h-5 mr-2 text-black dark:text-white" />
                      )}
                      Jenis Kelamin
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                          gender === 'male'
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                            : 'bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                        } transition-all duration-300`}
                      >
                        <Mars className="w-5 h-5" />
                        Laki-laki
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                          gender === 'female'
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                            : 'bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                        } transition-all duration-300`}
                      >
                        <Venus className="w-5 h-5" />
                        Perempuan
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Pekerjaan
                    </label>
                    <select 
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                    >
                      <option value="student">Pelajar/Mahasiswa</option>
                      <option value="professional">Profesional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <School className="w-5 h-5 mr-2 text-black dark:text-white" />
                      {formData.occupation === 'student' ? 'Nama Sekolah' : 'Tempat Kerja'}
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                      placeholder={`Masukkan ${formData.occupation === 'student' ? 'nama sekolah' : 'tempat kerja'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Information */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-6 border border-gray-200 dark:border-gray-800 transform hover:scale-[1.01] transition-transform duration-300 mb-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Informasi Fisik</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <Height className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Tinggi Badan (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                      placeholder="Masukkan tinggi badan"
                    />
                  </div>

                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <Weight className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Berat Badan (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                      placeholder="Masukkan berat badan"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-6 border border-gray-200 dark:border-gray-800 transform hover:scale-[1.01] transition-transform duration-300 mb-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Informasi Kontak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="whatsApp"
                      value={formData.whatsApp}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                      placeholder="Masukkan nomor WhatsApp"
                    />
                  </div>

                  <div>
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <Instagram className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Username Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                      placeholder="@username"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-black dark:text-white mb-2 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-black dark:text-white" />
                      Alamat Lengkap
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                      rows={3}
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                </div>
              </div>

              {/* Training Preferences */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800 transform hover:scale-[1.01] transition-transform duration-300 mb-8">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6">Preferensi Latihan</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-black dark:text-white mb-2">Lokasi Latihan</label>
                    <select
                      name="trainingLocation"
                      value={formData.trainingLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none transition-all duration-300"
                    >
                      <option value="sasana">Latihan di Sasana</option>
                      <option value="private">Latihan Privat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-black dark:text-white mb-4">Pilih Jadwal Latihan</label>
                    <div className="space-y-4">
                      {sortedDays.map((day) => (
                        <div
                          key={day}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <h4 className="text-lg font-semibold text-black dark:text-white mb-3">{day}</h4>
                          <div className="space-y-2">
                            {schedulesByDay[day].map((schedule) => (
                              <button
                                key={schedule.id}
                                type="button"
                                onClick={() => toggleSchedule(schedule.id)}
                                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                                  selectedSchedules.includes(schedule.id)
                                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                                    : 'border-gray-200 dark:border-gray-700 text-black dark:text-white hover:border-black dark:hover:border-white'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                                    </p>
                                    <p className="text-sm opacity-80">{schedule.description}</p>
                                  </div>
                                  <Clock className="w-5 h-5" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 text-black dark:text-white font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Kirim Pendaftaran'
                )}
              </button>
            </form>
          </div>

          {/* Schedule Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-black rounded-3xl shadow-2xl p-8 sticky top-24 border border-gray-200 dark:border-gray-800 animate-fade-in">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                Jadwal Latihan
              </h3>
              
              <div className="space-y-4">
                {sortedDays.map((day) => (
                  <div
                    key={day}
                    className="group bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-black dark:text-white mb-1">{day}</h4>
                        {schedulesByDay[day].map((schedule) => (
                          <p key={schedule.id} className="text-black dark:text-white text-lg mb-2">
                            {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                          </p>
                        ))}
                      </div>
                    </div>
                    <p className="text-black/70 dark:text-white/70 mb-4">{schedulesByDay[day][0]?.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-black/60 dark:text-white/60">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mr-2" />
                        Instruktur berpengalaman
                      </div>
                      <div className="flex items-center text-black/60 dark:text-white/60">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mr-2" />
                        Akses ke fasilitas lengkap
                      </div>
                      <div className="flex items-center text-black/60 dark:text-white/60">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mr-2" />
                        Rencana pembelajaran terstruktur
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;