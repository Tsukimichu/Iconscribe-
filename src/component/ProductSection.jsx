import React, { useRef, useState } from 'react';
import atp from '../assets/atp.png';
import calendar from '../assets/calendar.png';
import yearbook from '../assets/yearbook.png';
import org from '../assets/org.jpg';
import fb from '../assets/fb.png';
import phone from '../assets/Phone.png';
import card from '../assets/form.png';
import sticker from '../assets/ICONS.png';

function ProductSection() {
  const allServices = [
    { title: 'Official Receipts', description: 'Print BIR-compliant official receipts with premium quality and clear, smudge-free ink. Ideal for businesses needing reliable, legal transaction records.', image: atp, alt: 'Official Receipts' },
    { title: 'Calendars', description: 'Custom calendars designed with your branding in mind — perfect for giveaways or marketing materials that keep your business top of mind all year round.', image: calendar, alt: 'Calendars' },
    { title: 'Brochures', description: 'Impress clients with professionally printed brochures that clearly showcase your products, services, and story — available in various folds and finishes.', image: calendar, alt: 'Brochures' },
    { title: 'Yearbooks', description: 'Capture unforgettable memories with high-quality yearbooks tailored for schools, organizations, or events. Fully customizable layouts and durable binding.', image: yearbook, alt: 'Yearbooks' },
    { title: 'Books', description: 'From self-published novels to company manuals, we offer book printing with flexible options in size, cover type, and binding for a polished, bookstore-ready finish.', image: yearbook, alt: 'Books' },
    { title: 'Document Printing', description: 'Fast and accurate document printing for school, business, or personal needs. Choose from black & white or full color, with optional binding or stapling.', image: org, alt: 'Document Printing' },
    { title: 'Flyers', description: 'Promote your business or event with eye-catching flyers. We offer vibrant, full-color prints on various paper stocks and sizes for maximum impact.', image: fb, alt: 'Flyers' },
    { title: 'Posters', description: 'Make a statement with large-format posters ideal for advertising, announcements, or décor. Crisp visuals, bold colors, and available in multiple sizes.', image: fb, alt: 'Posters' },
    { title: 'Business Cards', description: 'Leave a lasting impression with professionally designed and printed business cards. Choose from matte, glossy, textured, or custom finishes.', image: card, alt: 'Business Cards' },
    { title: 'ID Printing', description: 'Durable and high-resolution ID cards for schools, companies, and events. Includes barcode, QR, and hologram options upon request.', image: phone, alt: 'ID Printing' },
    { title: 'Labels', description: 'Custom printed labels for products, packaging, or organization. Available in waterproof, removable, and permanent adhesive varieties.', image: sticker, alt: 'Labels' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const filteredServices = allServices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

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

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search a service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-full w-full max-w-md bg-white/10 text-white placeholder-white/60 focus:outline-none border border-white/20 focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      {/* Swipeable Product Cards */}
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
            <div
              key={index}
              onClick={() => alert(`You clicked on ${service.title}`)}
              className="min-w-[220px] h-[280px] bg-white/10 border border-white/20 rounded-2xl shadow-md backdrop-blur-md flex-shrink-0 snap-center overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="h-2/3 w-full">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/3 px-3 py-2 text-center flex flex-col justify-center items-center">
                <h3 className="text-sm font-semibold text-yellow-300">{service.title}</h3>
                <p className="text-xs text-white/70 mt-1">{service.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/60 px-4">No matching service found.</p>
        )}
      </div>

      {/* Hide scrollbar on all browsers */}
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
