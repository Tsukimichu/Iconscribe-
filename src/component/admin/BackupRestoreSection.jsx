import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { Download, Trash2 } from 'lucide-react';

const BackupRestoreSection = () => {
  const backupStats = [
    { label: 'Total Backups', count: 10, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Successful', count: 8, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Failed', count: 2, bg: 'bg-red-50', text: 'text-red-700' },
  ];

  const backupChart = {
    series: [{ name: 'Size (MB)', data: [1200, 800, 1500, 200] }],
    options: {
      chart: { type: 'bar', toolbar: { show: false } },
      xaxis: { categories: ['May 8', 'May 7 (1)', 'May 7 (2)', 'May 7 (3)'] },
      plotOptions: { bar: { borderRadius: 6 } },
      colors: ['#3b82f6'],
      tooltip: { theme: 'light' },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 rounded-3xl bg-white shadow-2xl space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-4xl font-extrabold text-[#243b7d] mb-1">Backup & Restore</h1>
          <p className="text-gray-600 text-lg">Manage your data safety</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {backupStats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 250 }}
            className={`rounded-xl px-5 py-4 text-center shadow-md flex flex-col justify-center items-center ${stat.bg}`}
          >
            <p className={`text-3xl font-bold mb-1 ${stat.text}`}>
              {stat.count.toString().padStart(2, '0')}
            </p>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Backup Size Over Time</h2>
        <Chart options={backupChart.options} series={backupChart.series} type="bar" height={260} />
      </div>
    </motion.div>
  );
};

export default BackupRestoreSection;
