import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const OverviewSection = () => {
  const statusCards = [
    { label: 'In Review', count: 6, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Ongoing', count: 1, bg: 'bg-purple-50', text: 'text-purple-700' },
    { label: 'Pending', count: 1, bg: 'bg-yellow-50', text: 'text-yellow-800' },
    { label: 'Out for Delivery', count: 1, bg: 'bg-orange-50', text: 'text-orange-800' },
    { label: 'Completed', count: 7, bg: 'bg-green-50', text: 'text-green-700' },
  ];

  const orderData = {
    series: [
      { name: 'Jan', data: [120, 90, 70, 50, 30] },
      { name: 'Feb', data: [100, 80, 60, 40, 25] },
      { name: 'Mar', data: [140, 110, 90, 60, 45] },
      { name: 'Apr', data: [160, 130, 100, 80, 55] },
    ],
    options: {
      chart: { type: 'area', stacked: false, toolbar: { show: false }, animations: { enabled: true, speed: 600 } },
      xaxis: { categories: ['Official Receipt', 'Calendar', 'Yearbook', 'Book', 'Mug'] },
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      legend: { position: 'top', horizontalAlign: 'left' },
      fill: { opacity: 0.3 },
      colors: ['#6366f1', '#f97316', '#10b981', '#2563eb'],
      tooltip: { theme: 'light' },
    },
  };

  const salesData = {
    series: [{ name: 'Sales', data: [180, 140, 110, 90, 70] }],
    options: {
      chart: { type: 'line', toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
      xaxis: { categories: ['Official Receipt', 'Calendar', 'Yearbook', 'Book', 'Mug'] },
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      colors: ['#10b981'],
      markers: { size: 4 },
      tooltip: { theme: 'light' },
    },
  };

  const reportData = {
    series: [264.64, 230.12, 175.5, 90.2, 250.2],
    options: {
      chart: { type: 'donut' },
      labels: ['Official Receipt', 'Calendar', 'Book', 'Mug', 'Yearbook'],
      legend: { position: 'bottom' },
      colors: ['#4285f4', '#fbbc05', '#ea4335', '#34a853', '#7b68ee'],
      plotOptions: { pie: { donut: { size: '60%' } } },
      tooltip: { theme: 'light' },
    },
  };

  const expenseData = {
    series: [
      { name: 'Paper', data: [80, 95, 70, 85] },
      { name: 'Ink', data: [60, 75, 65, 70] },
      { name: 'Salary', data: [120, 110, 130, 125] },
      { name: 'Misc', data: [30, 45, 25, 40] },
    ],
    options: {
      chart: { type: 'bar', stacked: true, toolbar: { show: false } },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] },
      legend: { position: 'bottom' },
      plotOptions: { bar: { borderRadius: 6 } },
      colors: ['#6366f1', '#f97316', '#10b981', '#f43f5e'],
      tooltip: { theme: 'light' },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 rounded-3xl space-y-6 bg-transparent"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-4xl font-extrabold text-[#243b7d] mb-1">Overview</h1>
          <p className="text-gray-600 text-lg">Hello Admin!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {statusCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 250 }}
            className={`rounded-xl px-5 py-4 text-center flex flex-col justify-center items-center ${card.bg}`}
          >
            <p className={`text-3xl font-bold mb-1 ${card.text}`}>
              {card.count.toString().padStart(2, '0')}
            </p>
            <p className="text-sm font-medium text-gray-700">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-transparent border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Total Orders</h2>
          <Chart options={orderData.options} series={orderData.series} type="area" height={260} />
        </div>
        <div className="p-5 rounded-xl bg-transparent border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Total Sales</h2>
          <Chart options={salesData.options} series={salesData.series} type="line" height={260} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-transparent border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Reports</h2>
          <Chart options={reportData.options} series={reportData.series} type="donut" height={300} />
        </div>
        <div className="p-5 rounded-xl bg-transparent border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Expenses</h2>
          <Chart options={expenseData.options} series={expenseData.series} type="bar" height={300} />
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewSection;
