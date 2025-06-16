import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/ICONS.png';
import bgImage from '../assets/org.jpg';

function Signup() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-cover bg-bottom flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full text-center">

        {/* Back to Homepage Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 text-sm text-blue-700 font-semibold hover:underline"
        >
          ← Back to Home
        </button>

        <div className="flex justify-center mb-4 mt-2">
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign up</h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-[#243b7d] text-white py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
            Login
          </span>
        </p>

        <p className="mt-4 text-xs text-gray-500">
          By signing up, you agree to Icons{' '}
          <a
            href="/terms"
            className="text-blue-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="text-blue-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}

export default Signup;
