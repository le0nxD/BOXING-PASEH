import React from 'react';
import { Award } from 'lucide-react';

const Coaches = () => {
  const coaches = [
    {
      name: "Ferry Musa",
      role: "Pelatih Kepala",
      experience: "20+ tahun pengalaman",
      achievements: [
        "Melatih 5 Juara Nasional",
        "Pelatih Terbaik 2023",
        "Sertifikasi Internasional"
      ],
      badges: ["Master", "Elite"],
      image: "https://i.pinimg.com/736x/b3/3a/46/b33a46c2aa0c5045b6e1df7660fd2937.jpg"
    },
      {
      name: "Yanto Gunhar",
      role: "Asisten Pelatih",
      experience: "15+ tahun pengalaman",
      achievements: [
        "Mantan Petinju Profesional",
        "Juara Nasional 2018",
        "Master Trainer"
      ],
      badges: ["Olimpiade", "Elite"],
      image: "https://i.pinimg.com/736x/49/e7/f3/49e7f34b98f06398ba161072cd49fbe2.jpg"
    },
    {
      name: "Ato Riyanto",
      role: "Pelatih Teknik",
      experience: "12+ tahun pengalaman",
      achievements: [
            "Pelatih Tinju Bersertifikat",
            "Peraih Medali Emas Regional",
            "Motivator Kebugaran Profesional"
      ],
      badges: ["Teknis", "Pro"],
      image: "https://i.pinimg.com/736x/62/a7/e3/62a7e3afa674e564d362083fc2aef338.jpg"
    },
        {
      name: "Wendy Omen",
      role: "Pelatih Kondisi Fisik",
      experience: "13+ tahun pengalaman",
      achievements: [
              "Pelatih Muda Terbaik 2018",
              "Ahli Pengembangan Junior",
              "Sertifikat Psikologi Anak"
      ],
      badges: ["Strength", "Certified"],
      image: "https://i.pinimg.com/736x/53/0c/49/530c4930c7347e442d92eeca79dce7a6.jpg"
    },
    {
      name: "Dicky Chica",
      role: "Pelatih  Junior",
      experience: "10+ tahun pengalaman",
      achievements: [
        "Pelatih Kekuatan Bersertifikat",
        "Ahli Kebugaran",
        "Spesialis Ilmu Olahraga"
      ],
      badges: ["Youth", "Expert"],
      image: "https://i.pinimg.com/736x/e8/ef/53/e8ef532cda27edef57174fae3cecab89.jpg"
    },
    {
      name: "Adam Cutter",
      role: "Pelatih Elite",
      experience: "8+ tahun pengalaman",
      achievements: [
        "Pengalaman Pelatihan Regional",
        "Pelatih Regional",
        "Spesialis Kinerja Elite Regional"
      ],
      badges: ["Elite"],
      image: "https://i.pinimg.com/736x/d8/ed/5f/d8ed5fe1d61d2bfe053359c2ee6f8336.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map((coach, index) => (
            <div 
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <div className="relative h-[400px] overflow-hidden">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                  {coach.badges.map((badge, badgeIndex) => (
                    <span 
                      key={badgeIndex}
                      className="px-3 py-1 bg-white/90 dark:bg-black/90 text-black dark:text-white text-sm rounded-full shadow-lg transform -translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
                      style={{ transitionDelay: `${badgeIndex * 100}ms` }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-md">
  <h3 className="text-2xl font-bold text-white mb-2">{coach.name}</h3>
  <p className="text-lg text-white/90 mb-2">{coach.role}</p>
<p className="text-white/80 mb-4 font-bold">{coach.experience}</p>

                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {coach.achievements.map((achievement, achievementIndex) => (
                      <div 
                        key={achievementIndex} 
                        className="flex items-center gap-2"
                      >
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white/90">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coaches;