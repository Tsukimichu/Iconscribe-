import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import atp from '../assets/atp.png';
import calendar from '../assets/calendar.png';
import yearbook from '../assets/yearbook.png';
import org from '../assets/org.jpg';
import fb from '../assets/fb.png';
import phone from '../assets/Phone.png';
import card from '../assets/form.png';
import sticker from '../assets/ICONS.png';
import poster from '../assets/Poster.png'
import book from '../assets/books.png';
import brochure from '../assets/bro1chure.png'


function ProductSection() {
  const allServices = [
    { title: 'Official Receipts', description: 'Print BIR-compliant official receipts with premium quality and clear, smudge-free ink.', image: atp, alt: 'Official Receipts', link: '/official-receipt' },
    { title: 'Calendars', description: 'Custom calendars designed with your branding in mind — perfect for giveaways or marketing materials.', image: calendar, alt: 'Calendars', link: '/calendars' },
    { title: 'Brochures', description: 'Professionally printed brochures that clearly showcase your products and services.', image: brochure, alt: 'Brochures', link: '/brochures' },
    { title: 'Yearbooks', description: 'Capture memories with high-quality yearbooks for schools, organizations, or events.', image: yearbook, alt: 'Yearbooks', link: '/yearbooks' },
    { title: 'Books', description: 'Book printing for self-published novels, company manuals, and more.', image: book, alt: 'Books', link: '/books' },
    { title: 'Document Printing', description: 'Fast and accurate document printing for school, business, or personal needs.', image: org, alt: 'Document Printing', link: '/documents' },
    { title: 'Flyers', description: 'Promote your business with vibrant, full-color flyers.', image: fb, alt: 'Flyers', link: '/flyers' },
    { title: 'Posters', description: 'Large-format posters ideal for advertising or décor.', image: poster, alt: 'Posters', link: '/posters' },
    { title: 'Business Cards', description: 'High-quality business cards with various finishes.', image: card, alt: 'Business Cards', link: '/business-cards' },
    { title: 'ID Printing', description: 'Durable and high-resolution ID cards with optional features.', image: phone, alt: 'ID Printing', link: '/id-printing' },
    { title: 'Labels', description: 'Custom labels for products or packaging in waterproof or adhesive options.', image: sticker, alt: 'Labels', link: '/labels' },
    { title: 'Calling Card', description: 'Print high-quality calling cards.', image: atp, alt: 'Calling Card', link: '/calling-card' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const filteredServices = allServices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (filteredServices.length === 1 && cardRefs.current[0]) {
      cardRefs.current[0].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [filteredServices]);

  useEffect(() => {
    if (searchQuery === '' && carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [searchQuery]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => { isDragging.current = false; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section id="product" className="py-20 px-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-yellow-400 drop-shadow-lg tracking-wide">
        Services Offered
      </h2>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search a service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-full w-full max-w-md bg-white/10 text-white placeholder-white/60 focus:outline-none border border-white/20 focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      <div
        ref={carouselRef}
        className="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-6 px-2 py-4 cursor-grab active:cursor-grabbing touch-pan-x"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
<Link
  to={service.link}
  key={index}
  ref={el => cardRefs.current[index] = el}
  className="min-w-[250px] max-w-[300px] h-[310px] bg-white/10 border border-white/20 rounded-xl shadow-lg backdrop-blur-sm flex-shrink-0 snap-center overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
>
  {/* Image Section */}
  <div className="h-[60%] w-full flex items-center justify-center bg-transparent">
    <img
      src={service.image}
      alt={service.alt}
      className="h-[90%] w-auto object-contain"
    />
  </div>

  {/* Text Section */}
  <div className="h-[40%] px-4 py-3 flex flex-col justify-center items-center text-center">
    <h3 className="text-base font-semibold text-yellow-300">{service.title}</h3>
    <p className="text-xs text-white/70 mt-1">{service.description}</p>
  </div>
</Link>

          ))
        ) : (
          <p className="text-white/60 px-4">No matching service found.</p>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

export default ProductSection;
