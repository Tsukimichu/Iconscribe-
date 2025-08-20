import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/ICONS.png';
import bgImage from '../assets/org.jpg';
import { User, Lock } from 'lucide-react';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); 

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', role);
    onLogin();

    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'manager') {
      navigate('/manager');
    } else {
      navigate('/dashboard'); 
    }
  };

  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]"></div>

      
      <div className="relative bg-white/20 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-white/30">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-30 drop-shadow-md" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-600" size={18} />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-600" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          
          <div className="text-left">
            <label htmlFor="role" className="block text-gray-700 text-sm mb-1">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-xl py-2 px-3 bg-white/70 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            Login
          </button>
        </form>

        <div className="text-sm text-center text-gray-800 mt-4">
          Don't have an account? <a href="/signup" className="text-yellow-500 font-medium hover:underline">Sign up</a>
        </div>

        <p className="mt-6 text-xs text-gray-700 text-center">
          By signing up, you agree to Icons' <a href="/terms" className="text-yellow-500 hover:underline">Terms of service</a> and <a href="/privacy" className="text-yellow-500 hover:underline">Privacy policy</a>.
        </p>
      </div>
    </div>
  );
}

export default Login;
