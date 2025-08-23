import { FaInstagram, FaFacebook, FaPhone } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

function Footer() {
  return (
    <footer className="bg-[#FAFAF6] text-black px-4 py-6">
      <div className="flex flex-col items-center space-y-4">

        
        <div className="flex space-x-6 text-2xl">
          <a href="mailto:info@example.com" aria-label="Email" title="Email" className="hover:text-gray-600">
            <MdOutlineEmail />
          </a>
          <a href="tel:+1234567890" aria-label="Phone" title="Phone" className="hover:text-gray-600">
            <FaPhone />
          </a>
        </div>

        
        <div className="w-full max-w-sm border-t border-black" />

        
        <div className="flex flex-wrap justify-center gap-x-6 text-sm">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>

        
        <div className="text-xs text-center">
          © 2025 <span className="font-semibold">ICONScribe</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
