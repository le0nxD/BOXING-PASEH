import React, { useState } from 'react';
import { MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const milestones = [
    {
      year: "1978",
      title: "Pendirian Sasana",
      description: "Awal mula berdirinya Sasana Paseh sebagai pusat pelatihan tinju di Tasikmalaya"
    },
    {
      year: "1990",
      title: "Ekspansi Fasilitas",
      description: "Pengembangan fasilitas latihan dengan peralatan modern"
    },
    {
      year: "2005",
      title: "Program Pembinaan",
      description: "Memulai program pembinaan atlet muda secara sistematis"
    },
    {
      year: "2024",
      title: "Inovasi Layanan",
      description: "Menerapkan inovasi untuk pengembangan atlet dan peningkatan pelatihan"
    }
  ];

  const facilities = [
    {
      title: "Ring Tinju Profesional",
      description: "Ring tinju standar internasional dengan matras berkualitas tinggi",
      image: "https://i.pinimg.com/736x/b4/28/14/b42814712889cc69248c1e7df67e6c1c.jpg"
    },
    {
      title: "Area Latihan Beban",
      description: "Dilengkapi peralatan fitness modern untuk latihan kekuatan",
      image: "https://i.pinimg.com/736x/06/a1/2a/06a12a7cc559b8cc199a9ba165aa2e54.jpg"
    },
    {
      title: "Ruang Kardio",
      description: "Area khusus untuk latihan kardio dan pemanasan",
      image: "https://i.pinimg.com/736x/51/14/99/5114993d6f84c8dc43e2264772545708.jpg"
    }
  ];

  const faqs = [
    {
      question: "Berapa biaya untuk bergabung dengan Sasana Paseh?",
      answer: "Di Sasana Paseh, kami percaya bahwa setiap anak muda berhak mendapatkan kesempatan untuk berkembang, tanpa terkendala oleh biaya. Oleh karena itu, kami menerapkan sistem kontribusi sukarela, di mana peserta dapat memberikan sesuai dengan kemampuan masing-masing. Bagi yang memiliki keterbatasan finansial, kami tetap membuka pintu selebar-lebarnya untuk bergabung dan tumbuh bersama."
    },
    {
      question: "Apakah ada batasan usia untuk bergabung?",
      answer: "Kami menerima anggota mulai dari usia 12 tahun ke atas. Untuk anak-anak di bawah 12 tahun, kami memiliki program khusus yang lebih fokus pada pengembangan motorik dasar."
    },
    {
      question: "Berapa kali latihan dalam seminggu?",
      answer: "Para anggota memiliki fleksibilitas untuk berlatih beberapa kali dalam seminggu sesuai kebutuhan mereka, dengan jadwal latihan yang tersedia dari Senin hingga Jumat pukul 06:00 hingga 21:00, Sabtu pukul 07:00 hingga 18:00, dan Minggu pukul 08:00 hingga 15:00."
    },
    {
      question: "Apakah disediakan peralatan latihan?",
      answer: "Ya, kami menyediakan semua peralatan latihan standar termasuk sarung tinju, samsak, ring tinju, dan peralatan latihan lainnya. Namun, untuk alasan kebersihan, kami menyarankan anggota memiliki sarung tinju pribadi."
    },
    {
      question: "Apakah ada program untuk pemula?",
      answer: "Ya, kami memiliki program khusus untuk pemula yang fokus pada teknik dasar, stamina, dan keselamatan. Program ini dirancang untuk membangun fondasi yang kuat sebelum berlanjut ke tingkat yang lebih tinggi."
    },
    {
      question: "Bagaimana proses pendaftaran?",
      answer: "Proses pendaftaran dapat dilakukan langsung di sasana atau melalui website. Anda hanya perlu mengisi formulir pendaftaran dan mengikuti sesi orientasi sebelum memulai latihan."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white/80 dark:from-black to-transparent py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
src="https://lh3.googleusercontent.com/pw/AP1GczODGd0Msd4ofSgH5yg1XV2aHsjktLhahNFMZ09WEE0VK_PIbJd0veuj8ozP6ixpXU5UY8PxhWqQR5xTe6TMukjFNcwmnNOl3HV61a38aQm4et9AYFgSnnCYyzfw0VH6OyDl_4PylBfVqux6qqNThKL_=w1181-h1039-s-no-gm?authuser=0"
                alt="Logo Sasana Paseh"
                className="w-64 h-64 object-contain mx-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-5xl font-bold text-black dark:text-white mb-6">Tentang Sasana Paseh</h1>
              <p className="text-black dark:text-white text-lg leading-relaxed mb-8">
                Didirikan pada tahun 1978, Sasana Paseh telah menjadi garda terdepan dalam 
                keunggulan tinju di Tasikmalaya. Komitmen kami untuk mengembangkan juara 
                melampaui ring, karena kami fokus pada pembentukan karakter, disiplin, 
                dan ketangguhan dalam setiap atlet.
              </p>
              <div className="flex items-center gap-4 text-black dark:text-white mb-4">
                <MapPin className="w-6 h-6 text-black dark:text-white" />
                <span>Jl. A.H. Witono, Tuguraja, Kec. Cihideung, Kota Tasikmalaya</span>
              </div>
              <div className="flex items-center gap-4 text-black dark:text-white">
                <Phone className="w-6 h-6 text-black dark:text-white" />
                <span>0877-8162-1981</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="py-16 bg-gray-50 dark:bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-black dark:text-white text-center mb-12">Perjalanan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900 rounded-2xl p-8 text-center transform hover:scale-105 transition duration-300 border border-gray-200 dark:border-gray-800"
              >
                <div className="text-4xl font-bold text-black dark:text-white mb-4">{milestone.year}</div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{milestone.title}</h3>
                <p className="text-black/70 dark:text-white/70">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-black dark:text-white text-center mb-12">Fasilitas Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-300 border border-gray-200 dark:border-gray-800"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">{facility.title}</h3>
                  <p className="text-black/70 dark:text-white/70">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50 dark:bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-black dark:text-white text-center mb-12">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-black dark:text-white">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-black dark:text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black dark:text-white" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-48 py-4' : 'max-h-0'
                  }`}
                >
                  <p className="text-black dark:text-white">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;