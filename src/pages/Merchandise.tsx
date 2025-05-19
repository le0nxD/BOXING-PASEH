import React, { useState } from "react";
import {
  ShoppingCart,
  Share2,
  X,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Merchandise = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick} className="slick-next" aria-label="Selanjutnya">
      <ChevronRight className="w-5 h-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
    </button>
  );

  const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick} className="slick-prev" aria-label="Sebelumnya">
      <ChevronLeft className="w-5 h-5 text-black dark:text-white group-hover:text-white dark:group-hover:text-black" />
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_: any, next: number) => setCurrentSlide(next),
  };

  const handleShare = (product: any) => {
    setShowShareModal(true);
  };

  const handleCopyLink = (product: any) => {
    const url = `${window.location.origin}/merchandise?product=${product.id}`;
    navigator.clipboard.writeText(url);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const handleShareSocial = (platform: string, product: any) => {
    const url = encodeURIComponent(`${window.location.origin}/merchandise?product=${product.id}`);
    const text = encodeURIComponent(`Cek ${product.name} di Sasana Paseh Boxing!`);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const products = [
    {
      id: 1,
      name: "Kaos Boxing Camp - Blue",
      price: 100000,
      color: "Hitam",
      images: [
        "https://i.pinimg.com/736x/1c/70/0f/1c700f01c18f592639b8f92f01c7a7ca.jpg",
        "https://i.pinimg.com/736x/c6/62/a2/c662a269c8c33d5d48e6bb8da40c04e6.jpg",
        "https://i.pinimg.com/736x/f9/00/de/f900de264e4b9ee427fd9b014b211a3b.jpg",
      ],
      description:
        "Kaos premium dengan desain eksklusif Sasana Paseh Boxing Club. Dibuat dengan bahan katun combed 30s yang nyaman dan tahan lama.",
      features: [
        "Bahan katun combed 30s",
        "Sablon DTF berkualitas tinggi",
        "Jahitan double stitch",
        "Label eksklusif Sasana Paseh",
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 2,
      name: "Kaos Boxing Camp - Hitam",
      price: 100000,
      color: "Putih",
      images: [
        "https://i.pinimg.com/736x/8d/d9/47/8dd947bbd449f2504b8af69f5b2152c3.jpg",
        "https://i.pinimg.com/736x/8a/97/2c/8a972c67e139ad790728ee91623c8f20.jpg",
        "https://i.pinimg.com/736x/f9/00/de/f900de264e4b9ee427fd9b014b211a3b.jpg",
      ],
      description:
        "Kaos latihan dengan teknologi dry-fit untuk menjaga tubuh tetap kering selama latihan intensif.",
      features: [
        "Teknologi dry-fit",
        "Anti-bacterial coating",
        "Bahan ringan dan breathable",
        "Desain ergonomis",
      ],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 4,
      name: "Kaos Performance Elite - Abu-abu",
      price: 100000,
      color: "Abu-abu",
      images: [
        "https://i.pinimg.com/736x/c6/9c/c1/c69cc124f80e3d84039f792345c9a969.jpg",
        "https://i.pinimg.com/736x/2a/4c/0b/2a4c0b8a6e9a6e8322d3aef5ccb706f4.jpg",
        "https://i.pinimg.com/736x/f9/00/de/f900de264e4b9ee427fd9b014b211a3b.jpg",
      ],
      description:
        "Kaos performa tinggi dengan teknologi moisture-wicking untuk kenyamanan maksimal saat berlatih.",
      features: [
        "Teknologi moisture-wicking",
        "Bahan premium breathable",
        "Desain modern",
        "Jahitan tahan lama",
      ],
      sizes: ["S", "M", "L", "XL"],
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
    setIsZoomed(false);
    setCurrentSlide(0);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedSize("");
    setIsZoomed(false);
    setShowShareModal(false);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-800"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative h-72 product-card">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-10">
                  <button
                    className="p-2 bg-white/90 dark:bg-gray-800/90 text-black dark:text-white rounded-full shadow-lg hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(product);
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-3 leading-tight">
                  {product.name}
                </h3>
                <p className="text-black dark:text-white text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="space-y-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full text-black dark:text-white">
                      {product.color}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full text-black dark:text-white"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xl font-bold text-black dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 text-black dark:text-white rounded-lg hover:opacity-90 transition-all duration-300 font-medium text-sm transform hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Beli</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Bagikan Produk
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="w-5 h-5 text-black dark:text-white" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleShareSocial('facebook', selectedProduct)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-black dark:text-white">Facebook</span>
                </button>
                
                <button
                  onClick={() => handleShareSocial('twitter', selectedProduct)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Twitter className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-black dark:text-white">Twitter</span>
                </button>
                
                <button
                  onClick={() => handleShareSocial('whatsapp', selectedProduct)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="w-6 h-6"
                  />
                  <span className="text-sm text-black dark:text-white">WhatsApp</span>
                </button>
              </div>

              <button
                onClick={() => handleCopyLink(selectedProduct)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LinkIcon className="w-5 h-5 text-black dark:text-white" />
                <span className="text-black dark:text-white">Salin Tautan</span>
              </button>
            </div>
          </div>
        )}

        {/* Copied Toast */}
        {showCopiedToast && (
          <div className="fixed bottom-4 right-4 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg shadow-lg">
            Tautan berhasil disalin!
          </div>
        )}

        {/* Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="product-modal bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative">
              <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
                <h2 className="text-3xl font-bold text-black dark:text-white text-center flex-1">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
                >
                  <X className="w-6 h-6 text-black dark:text-white" />
                </button>
              </div>

              <div className="modal-content overflow-y-auto p-8 max-h-[calc(90vh-5rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div className="zoom-image-container rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 product-slider relative">
                      <Slider {...sliderSettings}>
                        {selectedProduct.images.map(
                          (image: string, index: number) => (
                            <div
                              key={index}
                              className="outline-none"
                              onClick={handleImageClick}
                            >
                              <img
                                src={image}
                                alt={`${selectedProduct.name} view ${
                                  index + 1
                                }`}
                                className={`w-full aspect-square object-cover zoom-image ${
                                  isZoomed && currentSlide === index
                                    ? "zoomed"
                                    : ""
                                }`}
                              />
                            </div>
                          )
                        )}
                      </Slider>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-black dark:text-white bg-white/40 dark:bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        Klik untuk memperbesar
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gray-50 dark:bg-black/30 rounded-xl p-6 backdrop-blur-sm">
                      <p className="text-black dark:text-white text-lg leading-relaxed mb-6">
                        {selectedProduct.description}
                      </p>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-black dark:text-white text-xl">
                          Fitur Utama:
                        </h3>
                        <ul className="space-y-3">
                          {selectedProduct.features.map(
                            (feature: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-center gap-3 text-black dark:text-white"
                              >
                                <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full" />
                                {feature}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-medium text-black dark:text-white mb-3">
                          Ukuran
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {selectedProduct.sizes.map((size: string) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 text-lg ${
                                selectedSize === size
                                  ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-medium transform scale-105"
                                  : "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:border-black dark:hover:border-white"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-black dark:text-white mb-3">
                          Jumlah
                        </label>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={decrementQuantity}
                            className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300 text-black dark:text-white transform hover:scale-105"
                          >
                            <Minus className="w-6 h-6" />
                          </button>
                          <span className="text-2xl font-semibold text-black dark:text-white min-w-[4rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={incrementQuantity}
                            className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300 text-black dark:text-white transform hover:scale-105"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-lg text-black dark:text-white">
                          Subtotal
                        </span>
                        <span className="text-3xl font-bold text-black dark:text-white">
                          {formatPrice(selectedProduct.price * quantity)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          window.location.href = `https://wa.me/6287781621981?text=Halo MinPa, saya ingin membeli ${selectedProduct.name} (${selectedProduct.color}, ${selectedSize}) sebanyak ${quantity} pcs`;
                        }}
                        className="w-full bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 text-black dark:text-white py-4 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium transform hover:scale-[1.02]"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        <span>Beli Sekarang</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-black/50 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-500">
              <div className="text-center space-y-8">
                <h2 className="text-4xl font-bold text-black dark:text-white mb-6 animate-fade-in">
                  Butuh Bantuan?
                </h2>
                <p
                  className="text-xl text-black/80 dark:text-white/80 mb-8 animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  Hubungi kami untuk informasi lebih lanjut tentang produk dan
                  pemesanan
                </p>
                <a
                  href="https://wa.me/6287781621981"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center"
                >
                  <button
                    className="relative px-12 py-4 bg-gradient-to-r from-white to-gray-200 dark:from-gray-800 dark:to-gray-800 text-black dark:text-gray-300 text-lg font-semibold rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                      Hubungi via WhatsApp
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 dark:from-blue-950 dark:via-gray-800 dark:to-blue-600 animate-gradient" />
                  </button>
                </a>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-black-500/20 dark:bg-white-400/10 rounded-full blur-xl animate-pulse delay-300" />
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-black-500/20 dark:bg-white-400/10 rounded-full blur-xl animate-pulse delay-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchandise;