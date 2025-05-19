import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const slides = [
    {
      image: "https://i.pinimg.com/736x/eb/1d/71/eb1d71bf8db8816f3baca4ab256c4d11.jpg",
      title: "SASANA PASEH BOXING CAMP",
      description: "Membentuk Generasi Juara Sejak 1978",
      link: "/registration"
    },
    {
      image: "https://i.pinimg.com/736x/dc/67/c0/dc67c02d234fde6ce7288c9f4773fbdb.jpg",
      title: "DI TANGAN PARA AHLI",
      description: "Dibimbing Langsung oleh Pelatih Berpengalaman",
      link: "/coaches"
    },
    {
      image: "https://i.pinimg.com/1200x/c4/55/f2/c455f24b7836ad26c24a97339bbc703f.jpg",
      title: "FASILITAS MEMADAI",
      description: "Berlatih dengan Peralatan Modern",
      link: "/gallery"
    }
  ];

  const highlights = [
    {
      image: "https://i.pinimg.com/736x/69/ba/bc/69babc26535fe2bfc36d0270ae50fc16.jpg",
      title: "Pelatihan Profesional",
      description: "Belajar dari pelatih berpengalaman dengan rekam jejak yang terbukti",
      link: "/coaches"
    },
    {
      image: "https://i.pinimg.com/736x/f2/a8/8c/f2a88c96a5ef3820f6bbc2d149fd2687.jpg",
      title: "Raih Impian Anda di Sini",
      description: "Jadilah bagian dari Paseh Boxing Camp yang terus berkembang",
      link: "/registration"
    },
    {
      image: "https://i.pinimg.com/736x/59/d5/aa/59d5aad29f0547600edce9afde074d5d.jpg",
      title: "Siap Berkompetisi",
      description: "Persiapkan diri untuk kompetisi amatir dan profesional",
      link: "/gallery"
    }
  ];

  const programs = [
    {
      title: "Program Pemula",
      description: "Pelajari dasar-dasar tinju dan tingkatkan kebugaran Anda",
      features: ["Teknik dasar", "Latihan kardio", "Pembentukan postur"],
      image: "https://i.pinimg.com/736x/63/d2/ae/63d2aee4341485cdfcfcbd2d0aa3c1c6.jpg"
    },
    {
      title: "Program Menengah",
      description: "Tingkatkan teknik dan kekuatan Anda",
      features: ["Kombinasi pukulan", "Latihan kekuatan", "Sparring ringan"],
      image: "https://i.pinimg.com/736x/5f/36/10/5f3610864c56c33919624b5e7e589394.jpg"
    },
    {
      title: "Program Kompetisi",
      description: "Persiapan khusus untuk atlet kompetitif",
      features: ["Strategi pertandingan", "Conditioning", "Mental training"],
      image: "https://i.pinimg.com/736x/0f/e3/2f/0fe32f9d1deef213c5f092b23e17247d.jpg"
    }
  ];

  const sponsors = [
    {
      name: "CV. SUNDA JAYA",
      image: "https://i.pinimg.com/736x/2b/7a/67/2b7a67c97e725c2fc87fd5e741a2dfe0.jpg",
      link: "#"
    },
    {
      name: "YAYASAN PASEH BERKARYA BOXING",
      image: "https://i.pinimg.com/736x/88/57/12/885712c81381d97bfd06982273c2da1c.jpg",
      link: "https://www.wartatasik.com/jadi-maskot-pertinjuan-di-kota-tasik-sasana-paseh-boxing-camp-raup-medali-di-simpang-jawara-cup/"
    },
    {
      name: "PERTINA",
      image: "https://i.pinimg.com/736x/fd/d6/5a/fdd65ae8e6564cbd10ad79be2f42de43.jpg",
      link: "https://www.beritasatu.com/network/wartatasik/343671/bentuk-kepengurusan-baru-pertina-kota-tasik-agendakan-pertandingan-rutin-dan-lisensi-wasit"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section with Slider */}
      <div className="relative h-[600px] w-full">
        <Slider {...settings} className="h-full">
          {slides.map((slide, index) => (
            <Link to={slide.link} key={index} className="block h-[600px]">
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/80 dark:from-black via-white/50 dark:via-black/50 to-transparent flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl animate-fade-in">
                      <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">{slide.title}</h1>
                      <p className="text-xl md:text-3xl text-black/80 dark:text-white/80 font-light">{slide.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>

      {/* Programs Section */}
      <div className="py-16 bg-gray-50 dark:bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12">Program Latihan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-800">
                <div className="h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{program.title}</h3>
                  <p className="text-black/80 dark:text-white/80 mb-4">{program.description}</p>
                  <ul className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-black/70 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12">Mengapa Memilih Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((feature, index) => (
              <Link to={feature.link} key={index} className="block">
                <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-300 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-black dark:text-white">{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div className="py-16 bg-gray-50 dark:bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12 animate-fade-in">Didukung oleh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <a 
                href={sponsor.link} 
                key={index} 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden shadow-xl border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-500 transform hover:scale-105 hover:rotate-1"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="p-8">
                  <div className="h-40 flex items-center justify-center bg-white rounded-xl p-4 transform group-hover:scale-110 transition-transform duration-500">
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-6 text-center relative z-10">
                    <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 ease-in-out">
                      {sponsor.name}
                    </h3>
                    <div className="w-0 h-0.5 bg-black dark:bg-black mx-auto mt-2 group-hover:w-full group-hover:bg-gray-700 dark:group-hover:bg-white transition-all duration-1000" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-teal-500/20 dark:from-green-500/10 dark:via-blue-500/5 dark:to-teal-500/10 animate-gradient" />
    
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-black/50 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-500">
            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold text-black dark:text-white mb-6 animate-fade-in">
                Siap Memulai Perjalanan Anda?
              </h2>
              <p className="text-xl text-black/80 dark:text-white/80 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Bergabunglah dengan kami dan jadilah bagian dari keluarga juara
              </p>
              <Link 
                to="/registration" 
                className="group inline-flex items-center"
              >
                <button 
                  className="relative px-12 py-4 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 text-black dark:text-gray-300 text-lg font-semibold rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in" 
                  style={{ animationDelay: '0.4s' }}>
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                    Mulai Berlatih Sekarang
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-teal-500/20 dark:from-green-500/10 dark:via-blue-500/5 dark:to-teal-500/10 animate-gradient" />
                </button>
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-black500/20 dark:bg-white-400/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-black-500/20 dark:bg-white-400/10 rounded-full blur-xl animate-pulse delay-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;