import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "../api";

import "swiper/css";
import "swiper/css/navigation";

// Assets
import Officialreceipt from "../assets/atp.png";
import calendar from "../assets/calendar.png";
import card from "../assets/CallingCard.png";
import label from "../assets/Label.png";
import posters from "../assets/Flyers.png";
import flyers from "../assets/Posters.png";
import books from "../assets/Book.png";
import Brochure from "../assets/Brochure.png";
import Binding from "../assets/Binding.png";
import Invitation from "../assets/Invitation.png";
import RaffleTicket from "../assets/RaffleTicket.png";
import NewsLetter from "../assets/NewsLetter.png";

function ProductSection() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const productAssets = React.useMemo(() => [
    { title: "OfficialReceipt", description: "BIR-compliant official receipts with premium quality, smudge-free ink.", image: Officialreceipt, alt: "Official Receipts", link: "/official-receipt" },
    { title: "Calendars", description: "Custom calendars designed with your branding in mind.", image: calendar, alt: "Calendars", link: "/calendars" },
    { title: "Brochure", description: "Professionally printed brochures to showcase your products and services.", image: Brochure, alt: "Brochures", link: "/brochure" },
    { title: "Books", description: "Book printing for self-published novels, manuals, and more.", image: books, alt: "Books", link: "/books" },
    { title: "Flyers", description: "Promote your business with vibrant, full-color flyers.", image: flyers, alt: "Flyers", link: "/flyers" },
    { title: "Posters", description: "Large-format posters ideal for advertising or décor.", image: posters, alt: "Posters", link: "/posters" },
    { title: "Label", description: "Custom labels for packaging in waterproof or adhesive options.", image: label, alt: "Labels", link: "/labels" },
    { title: "CallingCard", description: "Print high-quality calling cards with sharp details.", image: card, alt: "Calling Card", link: "/calling-card" },
    { title: "Binding", description: "Binding", image: Binding, alt: "Binding", link: "/binding" },
    { title: "Invitation", description: "Invitation", image: Invitation, alt: "Invitation", link: "/invitation" },
    { title: "RaffleTicket", description: "RaffleTicket", image: RaffleTicket, alt: "RaffleTicket", link: "/raffleticket" },
    { title: "NewsLetter", description: "NewsLetter", image: NewsLetter, alt: "NewsLetter", link: "/newsletter" },
  ], []);

  
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        // only include products that are active
        const active = data.filter(
          (p) => p.status?.toLowerCase() === "active"
        );

        // attach image & link from productAssets map
        const mapped = active.map((p) => {
          const asset = productAssets.find(
            (a) => a.title.toLowerCase() === p.product_name.toLowerCase()
          );

          return {
            title: p.product_name,
            description: `${p.product_name} printing service.`,
            image: asset?.image || null,
            link: `/product/${p.product_id}`,
            alt: asset?.alt || p.product_name,
          };
        });


        setServices(mapped);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setServices([]);
      });
  }, [productAssets]);


  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Refs for custom navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section id="product" className="relative py-25 px-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.07),transparent_70%)] animate-pulse-slow" />
      <div className="absolute inset-0 bg-[conic-gradient(at_top_right,rgba(34,211,238,0.05),transparent_70%)] animate-spin-slow" />

      <h2 className="text-3xl text-white md:text-5xl font-extrabold text-center mb-16 tracking-wide relative z-10">
        Products <span className="text-yellow-400">Offered</span>
      </h2>

      <div className="relative mb-12 flex justify-center">
        <input
          type="text"
          placeholder="Search a service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-5 py-3 rounded-full w-full max-w-md bg-white/10 text-white placeholder-white/60 focus:outline-none border border-yellow-400/40 focus:ring-2 focus:ring-yellow-400 transition backdrop-blur-lg"
        />
      </div>

      {filteredServices.length > 0 ? (
        <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                spaceBetween={24}
                slidesPerView={3}
                loop={true}
                speed={2000}
                autoplay={{
                  delay: 4000,
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
                  className="group relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl h-[340px] flex flex-col overflow-hidden shadow-lg transition duration-500 hover:border-yellow-400/50 hover:shadow-yellow-400/20"
                >
                  <div className="h-[200px] w-full flex items-center justify-center bg-gradient-to-b from-transparent to-black/20 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.alt}
                      className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </div>
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

          <div
            ref={prevRef}
            className="custom-swiper-button-prev absolute -left-10 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-white/10 hover:bg-yellow-400/40 transition rounded-full p-3 backdrop-blur-lg shadow-md"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
          <div
            ref={nextRef}
            className="custom-swiper-button-next absolute -right-10 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-white/10 hover:bg-yellow-400/40 transition rounded-full p-3 backdrop-blur-lg shadow-md"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
      ) : (
        <p className="relative text-white/60 text-center mt-6">No matching service found.</p>
      )}

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow { animation: pulse-slow 12s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
      `}</style>
    </section>
  );
}

export default ProductSection;
