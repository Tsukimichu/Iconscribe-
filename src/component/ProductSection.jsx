import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "../api";

import "swiper/css";
import "swiper/css/navigation";

import DefaultImg from "../assets/default_product.png";

// --- Glow Animations --- //
const glowStyles = `
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.35; }
  }
  @keyframes spinGlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-glow { animation: pulseGlow 12s ease-in-out infinite; }
  .animate-glow-spin { animation: spinGlow 60s linear infinite; }
  .fade-in { animation: fadeIn 0.7s ease-out forwards; opacity: 0; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function ProductSection() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const BASE_URL = API_URL.replace("/api", "");

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const activeProducts = data.filter(
          (p) => p.status?.toLowerCase() === "active"
        );

        const mapped = activeProducts.map((p) => ({
          id: p.product_id,
          title: p.product_name,
          description:
            p.description || `${p.product_name} printing service available.`,
          image: p.image
            ? `${BASE_URL}/uploads/products/${p.image}`
            : DefaultImg,
          link: `/product/${p.product_id}`,
        }));

        setServices(mapped);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setServices([]);
      });
  }, []);

  // Better search (title + description)
  const filteredServices = services.filter((service) => {
    const q = searchQuery.toLowerCase();
    return (
      service.title.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q)
    );
  });

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      id="product"
      className="relative py-24 px-6 text-white overflow-hidden"
    >
      <style>{glowStyles}</style>

      {/* Glowing Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.07),transparent_70%)] animate-glow" />
      <div className="absolute inset-0 bg-[conic-gradient(at_top_right,rgba(34,211,238,0.05),transparent_70%)] animate-glow-spin" />

      {/* Title */}
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 tracking-wide relative z-10 fade-in">
        Products <span className="text-yellow-400">Offered</span>
      </h2>

      {/* Search */}
      <div className="relative mb-12 flex justify-center fade-in">
        <input
          type="text"
          placeholder="Search a product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-5 py-3 rounded-full w-full max-w-md bg-white/10 text-white placeholder-white/60 focus:outline-none border border-yellow-400/40 focus:ring-2 focus:ring-yellow-400 transition backdrop-blur-lg"
        />
      </div>

      {/* Product List */}
      {filteredServices.length > 0 ? (
        <div className="relative fade-in">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            spaceBetween={24}
            slidesPerView={3}
            loop={true}
            speed={1800}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {filteredServices.map((service, index) => (
              <SwiperSlide key={index}>
                <Link
                  to={service.link}
                  className="group relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl h-[350px] flex flex-col overflow-hidden shadow-lg transition duration-500 hover:border-yellow-300 hover:shadow-yellow-400/20 fade-in"
                >
                  {/* Image */}
                  <div className="h-[200px] w-full flex items-center justify-center bg-gradient-to-b from-transparent to-black/20 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 px-4 py-4 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-yellow-300 group-hover:text-yellow-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div
            ref={prevRef}
            className="absolute -left-10 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-white/10 hover:bg-yellow-400/40 transition rounded-full p-3 backdrop-blur-lg shadow-md"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>

          <div
            ref={nextRef}
            className="absolute -right-10 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-white/10 hover:bg-yellow-400/40 transition rounded-full p-3 backdrop-blur-lg shadow-md"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
      ) : (
        <p className="relative text-white/60 text-center mt-6 fade-in">
          No matching service found.
        </p>
      )}
    </section>
  );
}

export default ProductSection;