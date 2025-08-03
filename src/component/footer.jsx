import { FaInstagram, FaFacebook, FaPhone } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

function Footer() {
  return (
    <footer className="bg-[#FAFAF6] text-black px-3 py-2">
      <div className="flex flex-col items-center space-y-2">
        {/* Social Icons */}
        <div className="flex space-x-4 text-xl">
          <FaInstagram className="hover:text-gray-600 cursor-pointer" />
          <FaFacebook className="hover:text-gray-600 cursor-pointer" />
          <MdOutlineEmail className="hover:text-gray-600 cursor-pointer" />
          <FaPhone className="hover:text-gray-600 cursor-pointer" />
        </div>

        {/* Divider */}
        <div className="w-full max-w-xs border-t border-black" />

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-x-4 text-xs">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>

        {/* Copyright */}
        <div className="text-xs">
          © 2025 <span className="font-semibold">ICONScribe</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
