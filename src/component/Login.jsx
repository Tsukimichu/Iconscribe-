import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/ICONS.png';
import bgImage from '../assets/org.jpg';
import { User, Lock } from 'lucide-react';
import googleLogo from '../assets/google-logo.png'; // ✅ Updated path

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    onLogin(); // ✅ Notify app of login
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-sm w-full text-center transition-all duration-700">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-sm text-center text-gray-500">
            Don't have an account? <a href="/signup" className="text-blue-600 font-medium hover:underline">Sign up</a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#243b7d] text-white py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>

        <div className="my-4 border-t pt-4 text-center text-gray-600 text-sm">or</div>

        <button className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition">
          <img src={googleLogo} alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

        <p className="mt-6 text-xs text-gray-500 text-center">
          By signing up, you agree to Icons' <a href="/terms" className="text-blue-700 hover:underline">Terms of service</a> and <a href="/privacy" className="text-blue-700 hover:underline">Privacy policy</a>.
        </p>
      </div>
    </div>
  );
}

export default Login;
