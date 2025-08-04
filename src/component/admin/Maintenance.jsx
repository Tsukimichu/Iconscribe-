// Maintenance.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Maintenance = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = () => {
    console.log('Maintenance:', isMaintenance);
    console.log('Message:', message);
    // Optional: Save to backend or localStorage
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 min-h-screen bg-gray-50"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-200 relative overflow-hidden">
        {/* Background icon for design */}
        <div className="absolute right-5 top-5 text-blue-100 text-6xl select-none pointer-events-none z-0">
          ⚙️
        </div>

        <div className="relative z-10 p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-[#243b7d]">Maintenance Mode</h1>

          {/* Toggle switch */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Put site into maintenance mode</h2>
              <p className="text-sm text-gray-600">
                When enabled, users will not have access. Authorized users can log in via the login page.
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMaintenance}
                onChange={() => setIsMaintenance(!isMaintenance)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all duration-300 relative">
                <div className="w-5 h-5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:translate-x-full transition-transform"></div>
              </div>
            </label>
          </div>

          {/* Message box */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Maintenance mode message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your custom message here..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be shown to visitors during maintenance mode.
            </p>
          </div>

          {/* Save Button */}
          <div className="text-right">
            <button
              onClick={handleSave}
              className="bg-[#243b7d] hover:bg-[#1a2e65] text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Maintenance;
