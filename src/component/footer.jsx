import { FaInstagram, FaFacebook, FaPhone } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

function Footer() {
  return (
    <footer className="bg-[#FAFAF6] text-black px-4 py-6">
      <div className="flex flex-col items-center space-y-3">
        {/* Social Icons */}
        <div className="flex space-x-6 text-3xl">
          <FaInstagram className="hover:text-gray-600 cursor-pointer" />
          <FaFacebook className="hover:text-gray-600 cursor-pointer" />
          <MdOutlineEmail className="hover:text-gray-600 cursor-pointer" />
          <FaPhone className="hover:text-gray-600 cursor-pointer" />
        </div>

        {/* Divider */}
        <div className="w-full max-w-md border-t border-black mt-2"></div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-x-6 text-sm mt-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms and Condition</a>
        </div>

        {/* Copyright */}
        <div className="text-sm mt-2">
          Copyright 2025 © <span className="font-semibold">ICONScribe</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
