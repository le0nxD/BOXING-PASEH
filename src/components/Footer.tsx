import React from 'react';
import { Instagram, Phone, Mail, MapPin, Facebook, Music2 as BrandTiktok } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-100 to-white dark:from-black dark:to-gray-900 text-black dark:text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-6">
              <img 
src="https://lh3.googleusercontent.com/pw/AP1GczODGd0Msd4ofSgH5yg1XV2aHsjktLhahNFMZ09WEE0VK_PIbJd0veuj8ozP6ixpXU5UY8PxhWqQR5xTe6TMukjFNcwmnNOl3HV61a38aQm4et9AYFgSnnCYyzfw0VH6OyDl_4PylBfVqux6qqNThKL_=w1181-h1039-s-no-gm?authuser=0" 
                alt="SASANA PASEH" 
                className="w-24 h-24 object-contain rounded-lg shadow-lg"
              />
            </div>
            <p className="text-black dark:text-white text-sm text-justify leading-relaxed border-l-4 border-black dark:border-white pl-4">
              Yayasan Paseh Berkarya Boxing terus melahirkan petinju unggulan! 
              Dalam kejuaraan Simpang Jawara Cup 2023, Sasana Paseh meraih 
              11 emas, 4 perak, dan 2 perunggu, mempertahankan dominasinya di 
              Kota Tasikmalaya. Sebagai sasana tertua sejak 1978, kami bertekad 
              mencetak atlet berbakat hingga tingkat nasional.
            </p>
          </div>

          {/* Contact Us */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-black dark:text-white border-b-2 border-black dark:border-white pb-2 mb-6">Hubungi Kami</h3>
            <div className="space-y-4 mt-4">
              <a href="https://www.instagram.com/pasehboxingcamp/" 
                className="flex items-center gap-3 text-black dark:text-white hover:opacity-70 transition-opacity duration-300 justify-center md:justify-start group">
                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:translate-x-1 transition-transform duration-300">@pasehboxingcamp</span>
              </a>
              <a href="https://www.tiktok.com/@paseh.boxing.camp" 
                className="flex items-center gap-3 text-black dark:text-white hover:opacity-70 transition-opacity duration-300 justify-center md:justify-start group">
                <BrandTiktok className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:translate-x-1 transition-transform duration-300">@paseh.boxing.camp</span>
              </a>
              <a href="https://web.facebook.com/61568980854701/" 
                className="flex items-center gap-3 text-black dark:text-white hover:opacity-70 transition-opacity duration-300 justify-center md:justify-start group">
                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:translate-x-1 transition-transform duration-300">@Sasana Paseh</span>
              </a>
              <a href="https://wa.me/6287781621981" 
                className="flex items-center gap-3 text-black dark:text-white hover:opacity-70 transition-opacity duration-300 justify-center md:justify-start group">
                <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:translate-x-1 transition-transform duration-300">0877-8162-1981</span>
              </a>
              <a href="mailto:pasehboxingcamp@gmail.com" 
                className="flex items-center gap-3 text-black dark:text-white hover:opacity-70 transition-opacity duration-300 justify-center md:justify-start group">
                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:translate-x-1 transition-transform duration-300">pasehboxingcamp@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-black dark:text-white border-b-2 border-black dark:border-white pb-2 mb-6">Lokasi</h3>
            <div className="flex items-start gap-3 mb-4 mt-4">
              <MapPin className="text-black dark:text-white flex-shrink-0" size={28} />
              <span className="text-sm text-black dark:text-white leading-tight">
                Jl. A.H. Witono, Tuguraja, Kec. Cihideung, Kota Tasikmalaya, Jawa Barat 46125, Indonesia
              </span>
            </div>
            <div className="w-full h-48 rounded-lg overflow-hidden shadow-lg border-2 border-black dark:border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.130146858007!2d108.20628937537722!3d-7.339278272193145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f57a40e5a29f1%3A0x3c379dc26f1c2bd5!2sPaseh%20Boxing%20Camp!5e0!3m2!1sid!2sus!4v1742546875924!5m2!1sid!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Training Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-black dark:text-white border-b-2 border-black dark:border-white pb-2 mb-6">Jam Latihan</h3>
            <div className="space-y-4 bg-gray-50 dark:bg-black/30 p-6 rounded-lg mt-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-black dark:text-white">Senin - Jumat</p>
                <p className="text-black dark:text-white font-semibold text-lg">06:00 - 21:00</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-black dark:text-white">Sabtu</p>
                <p className="text-black dark:text-white font-semibold text-lg">07:00 - 18:00</p>
              </div>
              <div>
                <p className="text-black dark:text-white">Minggu</p>
                <p className="text-black dark:text-white font-semibold text-lg">08:00 - 15:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-black dark:text-white text-sm">
            © {new Date().getFullYear()} YAYASAN PASEH BERKARYA BOXING
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;