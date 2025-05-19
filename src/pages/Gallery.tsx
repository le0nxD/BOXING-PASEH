import React, { useState } from 'react';
import { Play } from 'lucide-react';

const Gallery = () => {
  const [filter, setFilter] = useState('all');

  const content = {
    training: [
      {
        type: "training",
        url: "https://i.pinimg.com/736x/c7/9a/31/c79a310b372ca7394f9f3a6e8946ea95.jpg",
      },
      {
        type: "training",
        url: "https://i.pinimg.com/736x/cd/fb/37/cdfb3726d5976c16b0d3e114855fff52.jpg",
      },
            {
        type: "training",
        url: "https://i.pinimg.com/736x/79/4c/27/794c27396568b116b2b1e65f05f794ec.jpg",
      },
      {
        type: "training",
        url: "https://i.pinimg.com/736x/cc/d7/23/ccd723263d4394980db1e348a187d572.jpg",
      },
            {
        type: "training",
        url: "https://i.pinimg.com/736x/5f/36/10/5f3610864c56c33919624b5e7e589394.jpg",
      },
            {
        type: "training",
        url: "https://i.pinimg.com/736x/40/cf/9e/40cf9e5e88f2832845da74587065a8be.jpg",
      },
            {
        type: "training",
        url: "https://i.pinimg.com/736x/db/33/34/db33340bedf1714fb5b3ca44fbbe6fb6.jpg",
      },
      {
        type: "training",
        url: "https://i.pinimg.com/736x/9e/b4/16/9eb416815b0776f567ce5d14c7ba2605.jpg",
      },
            {
        type: "training",
        url: "https://i.pinimg.com/736x/d0/aa/c8/d0aac849662973c8905403286314bdde.jpg",
      },
      {
        type: "training",
        url: "https://i.pinimg.com/736x/cc/8f/72/cc8f723f5ee315756dd6cb73e28cc806.jpg",
      },
            {
        type: "training",
        url: "https://i.pinimg.com/736x/6d/ed/67/6ded6775e10176fcb2396a29cc350195.jpg",
      },
      {
        type: "training",
        url: "https://i.pinimg.com/736x/0f/e3/2f/0fe32f9d1deef213c5f092b23e17247d.jpg",
      },
      {
        type: "training",
        url: "https://i.pinimg.com/736x/2e/32/95/2e329586f342e90128e77fcd3fe466ab.jpg",
      },
            {
        type: "training",
        url: "https://i.pinimg.com/736x/16/45/4b/16454b7238f20775b7c0565c4b0f5b65.jpg",
      },
      {
        type: "training",
        url: "https://i.pinimg.com/736x/31/59/5e/31595e460b8eff2548faf1f150c24461.jpg",
      }
    ],
       videos: [
      {
        type: "video",
        url: "https://drive.google.com/file/d/1Q-sIUYCjj7xrCx9LcSjJEATNMP4LenaL/view?usp=sharing",
        thumbnail: "https://i.pinimg.com/736x/92/fd/0e/92fd0e26201f7b35d860e4167d62d261.jpg",
      },
            {
        type: "video",
        url: "https://drive.google.com/file/d/1Yh1ZQbFEk7qtkn9JOtdAIv_zOpWxUWDQ/view?usp=sharing",
        thumbnail: "https://i.pinimg.com/736x/92/fd/0e/92fd0e26201f7b35d860e4167d62d261.jpg",
      },
      {
        type: "video",
        url: "https://drive.google.com/file/d/125B_oCqUWW1iLWXBkbIiQ2WbMLHvMLBh/view?usp=sharing",
        thumbnail: "https://i.pinimg.com/736x/92/fd/0e/92fd0e26201f7b35d860e4167d62d261.jpg",
      },
      {
        type: "video",
        url: "https://drive.google.com/file/d/1aCvm0Oloma2IAMC2KLfSM6iZ1rA9_lrs/view?usp=sharing",
        thumbnail: "https://i.pinimg.com/736x/92/fd/0e/92fd0e26201f7b35d860e4167d62d261.jpg",
      },
      {
        type: "video",
        url: "https://drive.google.com/file/d/1S_vqYn4V5pHw70ruTZHEbLGjZJb9yUNN/view?usp=sharing",
        thumbnail: "https://i.pinimg.com/736x/92/fd/0e/92fd0e26201f7b35d860e4167d62d261.jpg",
      },
      {
        type: "video",
        url: "https://drive.google.com/file/d/1rX7-CK0tT6_5SjMSPtaummzfmFrNXz1k/view?usp=sharing",
        thumbnail: "https://i.pinimg.com/736x/92/fd/0e/92fd0e26201f7b35d860e4167d62d261.jpg",
      }
    ],
    events: [
      {
        type: "event",
        url: "https://i.pinimg.com/736x/08/f1/09/08f109f8327d9bcf7ca2b58b1bbefa0a.jpg",
      },
      {
        type: "event",
        url: "https://i.pinimg.com/736x/7f/11/a8/7f11a8072e86afa662b327d8c7bd7ef1.jpg",
      },
      {
        type: "event",
        url: "https://i.pinimg.com/736x/a1/27/2e/a1272eff1903f916f6135e8b177b8b75.jpg",
      },
      {
        type: "event",
        url: "https://i.pinimg.com/736x/f0/58/a3/f058a3d7df316c4ee863d89e0e6dd5af.jpg",
      },
            {
        type: "event",
        url: "https://i.pinimg.com/1200x/c4/55/f2/c455f24b7836ad26c24a97339bbc703f.jpg",
      },
            {
        type: "event",
        url: "https://i.pinimg.com/736x/de/09/9c/de099c06aca0cc8709f3c6ec9a3466a0.jpg",
      },
            {
        type: "event",
        url: "https://i.pinimg.com/736x/23/27/96/232796df6d220a95eae824f9fdcfadbd.jpg",
      },
                  {
        type: "event",
        url: "https://i.pinimg.com/736x/06/e7/d8/06e7d81649822585e104694d2995134a.jpg",
      },
                  {
        type: "event",
        url: "https://i.pinimg.com/736x/cb/bd/dc/cbbddc57cafa382f51768090a2b77325.jpg",
      },
                  {
        type: "event",
        url: "https://i.pinimg.com/736x/31/18/7c/31187c59afdf118b13fb44f19588e817.jpg",
      },
                  {
        type: "event",
        url: "https://i.pinimg.com/736x/0e/fd/c5/0efdc5fd9f5b40f5dc75a6b390e38a3f.jpg",
      },
                  {
        type: "event",
        url: "https://i.pinimg.com/736x/89/f7/4d/89f74dd9f4443c0662ca68c26d6d6c89.jpg",
      },
                        {
        type: "event",
        url: "https://i.pinimg.com/736x/b8/cd/43/b8cd433cabc8b01bfc1ae541317f34c1.jpg",
      },
                  {
        type: "event",
        url: "https://i.pinimg.com/736x/21/d3/20/21d320919b12ba0ce79a03b4ee60b143.jpg",
      },
                       {
        type: "event",
        url: "https://i.pinimg.com/736x/3a/11/b7/3a11b78797df8ee823357af911ce0501.jpg",
      }
    ]
  };

  const allContent = [
    ...content.training,
    ...content.events,
    ...content.videos
  ];

  const filteredContent = filter === 'all' 
    ? allContent 
    : filter === 'videos' 
      ? content.videos 
      : filter === 'training' 
        ? content.training 
        : content.events;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-black dark:text-white text-center mb-8">Dokumentasi</h1>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition duration-300 ${
              filter === 'all' 
                ? 'bg-black dark:bg-white text-white dark:text-black' 
                : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border border-gray-200 dark:border-gray-700'
            }`}
          >
            Semua
          </button>
          <button 
            onClick={() => setFilter('videos')}
            className={`px-6 py-2 rounded-full transition duration-300 ${
              filter === 'videos' 
                ? 'bg-black dark:bg-white text-white dark:text-black' 
                : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border border-gray-200 dark:border-gray-700'
            }`}
          >
            Video
          </button>
          <button 
            onClick={() => setFilter('training')}
            className={`px-6 py-2 rounded-full transition duration-300 ${
              filter === 'training' 
                ? 'bg-black dark:bg-white text-white dark:text-black' 
                : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border border-gray-200 dark:border-gray-700'
            }`}
          >
            Foto
          </button>
          <button 
            onClick={() => setFilter('events')}
            className={`px-6 py-2 rounded-full transition duration-300 ${
              filter === 'events' 
                ? 'bg-black dark:bg-white text-white dark:text-black' 
                : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black border border-gray-200 dark:border-gray-700'
            }`}
          >
            Kejuaraan
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContent.map((item, index) => (
            <div key={index} className="group relative block bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden shadow-xl border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-500 transform hover:scale-105 hover:rotate-1">
              <div className="relative">
                <img
                  src={item.type === 'video' ? item.thumbnail : item.url}
                  alt={item.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
                />
<div className="absolute inset-0 bg-white/50 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  {item.type === 'video' ? (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-black dark:bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition duration-300"
                    >
                      <Play className="w-8 h-8 text-white dark:text-black" />
                    </a>
                  ) : (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-black dark:text-white text-xl font-bold transform scale-0 group-hover:scale-100 transition duration-300"
                    >
                      Lihat Gambar Penuh
                    </a>
                  )}
                </div>
              </div>
              <div className="p-6 bg-white/90 dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{item.title}</h3>
                <p className="text-black dark:text-white">
                  {item.type === 'video' ? 'Klik untuk menonton video' : 'Klik untuk melihat gambar penuh'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;