import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

// Assets
import atp from "../assets/atp.png";
import calendar from "../assets/calendar.png";
import document from "../assets/DocumentP.png";
import id from "../assets/ID.png";
import bcard from "../assets/BusinessCard.png";
import card from "../assets/CallingCard.png";
import sticker from "../assets/ICONS.png";
import poster from "../assets/Flyers.png";
import flyers from "../assets/Posters.png";
import book from "../assets/Book.png";
import brochure from "../assets/Brochure.png";

function ProductSection() {
  const allServices = [
    { title: "Official Receipts", description: "BIR-compliant official receipts with premium quality, smudge-free ink.", image: atp, alt: "Official Receipts", link: "/official-receipt" },
    { title: "Calendars", description: "Custom calendars designed with your branding in mind.", image: calendar, alt: "Calendars", link: "/calendars" },
    { title: "Brochures", description: "Professionally printed brochures to showcase your products and services.", image: brochure, alt: "Brochures", link: "/brochure" },
    { title: "Books", description: "Book printing for self-published novels, manuals, and more.", image: book, alt: "Books", link: "/books" },
    { title: "Document Printing", description: "Fast, accurate document printing for school, business, or personal needs.", image: document, alt: "Document Printing", link: "/documents" },
    { title: "Flyers", description: "Promote your business with vibrant, full-color flyers.", image: flyers, alt: "Flyers", link: "/flyers" },
    { title: "Posters", description: "Large-format posters ideal for advertising or décor.", image: poster, alt: "Posters", link: "/posters" },
    { title: "Business Cards", description: "High-quality business cards with various finishes.", image: bcard, alt: "Business Cards", link: "/business-card" },
    { title: "ID Printing", description: "Durable, high-resolution ID cards with optional features.", image: id, alt: "ID Printing", link: "/id-printing" },
    { title: "Labels", description: "Custom labels for packaging in waterproof or adhesive options.", image: sticker, alt: "Labels", link: "/labels" },
    { title: "Calling Card", description: "Print high-quality calling cards with sharp details.", image: card, alt: "Calling Card", link: "/calling-card" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const filteredServices = allServices.filter((service) =>
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
        Service <span className="text-yellow-400">Offered</span>
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
            spaceBetween={24}
            slidesPerView={3}
            loop={true}
            autoplay={{ delay: 4000 }}
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
