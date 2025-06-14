import React, { useRef, useState } from 'react';
import atp from '../assets/atp.png';
import brochure from '../assets/brochure.png';
import calendar from '../assets/calendar.png';
import yearbook from '../assets/yearbook.png';
import org from '../assets/org.jpg';
import fb from '../assets/fb.png';
import phone from '../assets/Phone.png';
import card from '../assets/form.png';
import sticker from '../assets/ICONS.png';

function ProductSection() {
  const allServices = [
    {
      title: 'Official Receipts (ATP)',
      description: 'We print government-accredited official receipts.',
      image: atp,
      alt: 'Official Receipts',
    },
    {
      title: 'Calendars & Brochures',
      description: 'Custom marketing materials to promote your brand.',
      image: calendar,
      alt: 'Calendars and Brochures',
    },
    {
      title: 'Yearbooks & Books',
      description: 'High-quality yearbook and book printing services.',
      image: yearbook,
      alt: 'Yearbooks and Books',
    },
    {
      title: 'Document Printing',
      description: 'Fast and affordable document printing for all needs.',
      image: org,
      alt: 'Document Printing',
    },
    {
      title: 'Flyers & Posters',
      description: 'Colorful flyers and posters for effective advertising.',
      image: fb,
      alt: 'Flyers and Posters',
    },
    {
      title: 'Business Cards',
      description: 'Professional business cards to leave a strong impression.',
      image: card,
      alt: 'Business Cards',
    },
    {
      title: 'ID Printing',
      description: 'PVC ID printing for schools, companies, and events.',
      image: phone,
      alt: 'ID Printing',
    },
    {
      title: 'Stickers & Labels',
      description: 'Custom sticker and label printing for all surfaces.',
      image: sticker,
      alt: 'Stickers and Labels',
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const filteredServices = allServices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="product" className="py-20 px-6 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white relative overflow-hidden">
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

      {/* Arrow Buttons */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <button onClick={scrollLeft} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-full shadow-lg">
          ◀
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <button onClick={scrollRight} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-full shadow-lg">
          ▶
        </button>
      </div>

      {/* Curved Carousel with Scrollbar */}
      <div className="relative perspective-[1000px]">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory px-4 py-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.3) transparent',
          }}
        >
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => {
              const rotation = (index - filteredServices.length / 2) * 10;
              const translateZ = 200;

              return (
                <button
                  key={index}
                  onClick={() => alert(`${service.title} clicked!`)}
                  className="min-w-[220px] h-[280px] bg-white/10 border border-white/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md text-white flex-shrink-0 snap-center transition-transform hover:scale-105 overflow-hidden"
                  style={{
                    transform: `rotateY(${rotation}deg) translateZ(${translateZ}px)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div className="w-full h-full flex flex-col">
                    {/* Image fills 2/3 of the card */}
                    <div className="h-2/3 w-full">
                      <img
                        src={service.image}
                        alt={service.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Text content */}
                    <div className="h-1/3 px-3 py-2 text-center flex flex-col justify-center items-center">
                      <h3 className="text-sm font-semibold text-yellow-300">{service.title}</h3>
                      <p className="text-xs text-white/70 mt-1">{service.description}</p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-white/60 px-4">No matching service found.</p>
          )}
        </div>
      </div>

      {/* Inline Scrollbar Styling */}
      <style>
      {`
        #product ::-webkit-scrollbar {
          height: 4px; /* Smaller height */
          width: 4px;
        }
        #product ::-webkit-scrollbar-track {
          background: transparent;
        }
        #product ::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin: 0 40px; /* Visually shortens scrollbar length */
        }
     `} 
      </style>

    </section>
  );
}

export default ProductSection;
