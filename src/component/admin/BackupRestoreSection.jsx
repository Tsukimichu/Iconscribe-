import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, UploadCloud } from 'lucide-react';

const BackupRestoreSection = () => {
  const [scheduled, setScheduled] = useState(true);
  const [frequency, setFrequency] = useState('Weekly');
  const [time, setTime] = useState('02:00');
  const [retention, setRetention] = useState('1 month');

  const backups = [
    { date: '2025-05-08 03:22', type: 'Full', size: '1.2 GB', status: 'Success' },
    { date: '2025-05-07 09:00', type: 'Partial', size: '800 MB', status: 'Success' },
    { date: '2025-05-07 03:22', type: 'Full', size: '1.5 GB', status: 'Success' },
    { date: '2025-05-07 03:22', type: 'Full', size: '200 MB', status: 'Failed' },
  ];

  const restores = [
    { date: '2025-05-01 12:34', by: 'Admin', status: 'Success' },
    { date: '2025-04-01 09:10', by: 'Admin', status: 'Success' },
  ];

  const statusColor = (status) => {
    return status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl space-y-6 border border-gray-200"
    >
      <div>
        <h1 className="text-4xl font-extrabold text-[#243b7d] mb-1">Backup & Restore</h1>
        <p className="text-gray-600 text-lg">Secure your data with scheduled backups and easy restores.</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-lg space-y-4 border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all">
            Create Backup
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Scheduled Backups</span>
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                scheduled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setScheduled(!scheduled)}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                  scheduled ? 'translate-x-6' : ''
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">{scheduled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 mt-4">
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option>00:00</option>
            <option>02:00</option>
            <option>06:00</option>
            <option>12:00</option>
          </select>

          <select
            value={retention}
            onChange={(e) => setRetention(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option>1 week</option>
            <option>1 month</option>
            <option>3 months</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Backup History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 font-semibold text-gray-600">Date</th>
                <th className="text-left p-2 font-semibold text-gray-600">Type</th>
                <th className="text-left p-2 font-semibold text-gray-600">Size</th>
                <th className="text-left p-2 font-semibold text-gray-600">Status</th>
                <th className="text-left p-2 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2">{b.date}</td>
                  <td className="p-2">{b.type}</td>
                  <td className="p-2">{b.size}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="p-1 rounded hover:bg-gray-200 transition" title="Download">
                      <Download size={16} />
                    </button>
                    <button className="p-1 rounded hover:bg-red-100 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Restore</h2>
        <div className="flex items-center gap-3 mb-4">
          <label htmlFor="upload" className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg cursor-pointer transition">
            <UploadCloud size={16} />
            Upload Backup File
          </label>
          <input id="upload" type="file" className="hidden" />
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2 font-semibold text-gray-600">Date</th>
              <th className="text-left p-2 font-semibold text-gray-600">Performed by</th>
              <th className="text-left p-2 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {restores.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.by}</td>
                <td className="p-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BackupRestoreSection;
