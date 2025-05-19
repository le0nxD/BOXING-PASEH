import React from 'react';
import { Award } from 'lucide-react';

const Officials = () => {
  const officials = [
  {
    "name": "Hanhan Sukmansyah",
    "role": "Kepala Resmi",
    "experience": "20+ tahun pengalaman",
    "achievements": ["Penghargaan KONI 2022", "Sertifikasi Internasional"],
    "image": "https://i.pinimg.com/736x/18/76/56/187656376d0177508dccf69155e6efb7.jpg",
    "badges": ["Tersertifikasi", "Internasional"]
  },
  {
    "name": "Dede Ocih",
    "role": "Kepala Administrasi",
    "experience": "20+ tahun pengalaman",
    "achievements": ["Pelatih Terbaik 2020", "Keunggulan Manajemen"],
    "image": "https://i.pinimg.com/736x/4b/3e/cb/4b3ecbe0ca0535b41c74212a7799f9ae.jpg",
    "badges": ["Profesional", "Keunggulan"]
  },
      {
    "name": "Marsekal Muda (Purn.) Yadi Indrayadi Sutanandika",
    "role": "Koordinator Keamanan",
    "experience": "20+ tahun pengalaman",
    "achievements": ["Penghargaan Keunggulan Keamanan", "Profesional Keamanan"],
    "image": "https://i.pinimg.com/736x/2d/8e/64/2d8e64eb38691e59f6ad92f8545e4ab8.jpg",
    "badges": ["Keamanan", "Profesional"]
  }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {officials.map((official, index) => (
            <div 
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <div className="relative h-[400px] overflow-hidden">
                <img
                  src={official.image}
                  alt={official.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                  {official.badges.map((badge, badgeIndex) => (
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
  <h3 className="text-2xl font-bold text-white mb-2">{official.name}</h3>
  <p className="text-lg text-white/90 mb-2">{official.role}</p>
<p className="text-white/80 mb-4 font-bold">{official.experience}</p>
                  
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {official.achievements.map((achievement, achievementIndex) => (
                      <div 
                        key={achievementIndex} 
                        className="flex items-center gap-2"
                      >
                        <Award className="w-5 h-5 text-gray-800 dark:text-gray-100" />
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

export default Officials;