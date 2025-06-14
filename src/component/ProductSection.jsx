import React, { useRef, useState } from 'react';

function ProductSection() {
  const allServices = [
    { title: 'Official Receipts (ATP)', description: 'Short description', image: '', alt: 'Image of Official Receipts' },
    { title: 'Calendars & Brochures', description: 'Short description', image: '', alt: 'Image of Calendars and Brochures' },
    { title: 'Yearbooks & Books', description: 'Short description', image: '', alt: 'Image of Yearbooks and Books' },
    { title: 'Document Printing', description: 'Short description', image: '', alt: 'Image of Document Printing' },
    { title: 'Flyers & Posters', description: 'Short description', image: '', alt: 'Image of Flyers and Posters' },
    { title: 'Business Cards', description: 'Short description', image: '', alt: 'Image of Business Cards' },
    { title: 'ID Printing', description: 'Short description', image: '', alt: 'Image of ID Printing' },
    { title: 'Stickers & Labels', description: 'Short description', image: '', alt: 'Image of Stickers and Labels' },
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
                  className="min-w-[220px] h-[280px] bg-white/10 border border-white/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md text-white flex-shrink-0 snap-center transition-transform hover:scale-105"
                  style={{
                    transform: `rotateY(${rotation}deg) translateZ(${translateZ}px)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div className="flex flex-col justify-center items-center p-4 text-center w-full h-full">
                    <div className="w-24 h-24 mb-4 bg-white/20 rounded-2xl flex items-center justify-center text-xs text-white/60">
                      {service.alt}
                    </div>
                    <h3 className="text-base font-semibold text-yellow-300 mb-1">{service.title}</h3>
                    <p className="text-sm text-white/70">{service.description}</p>
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
            height: 6px;
          }
          #product ::-webkit-scrollbar-track {
            background: transparent;
          }
          #product ::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}
      </style>
    </section>
  );
}

export default ProductSection;
