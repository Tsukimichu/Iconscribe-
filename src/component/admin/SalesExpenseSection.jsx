import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const SalesExpenseSection = () => {
  const summaryCards = [
    { label: 'Total Sales', value: '₱25,000', bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Total Expense', value: '₱15,000', bg: 'bg-red-50', text: 'text-red-700' },
    { label: 'Net Profit', value: '₱10,000', bg: 'bg-blue-50', text: 'text-blue-700' },
  ];

  const salesChart = {
    series: [{ name: 'Sales', data: [5000, 7000, 8000, 5000] }],
    options: {
      chart: { type: 'area', toolbar: { show: false } },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] },
      stroke: { curve: 'smooth', width: 2 },
      fill: { opacity: 0.3 },
      colors: ['#10b981'],
      tooltip: { theme: 'light' },
    },
  };

  const expenseChart = {
    series: [
      { name: 'Expense', data: [3000, 4000, 5000, 3000] },
    ],
    options: {
      chart: { type: 'bar', toolbar: { show: false } },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] },
      colors: ['#ef4444'],
      plotOptions: { bar: { borderRadius: 6 } },
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
          <h1 className="text-4xl font-extrabold text-[#243b7d] mb-1">Sales & Expense</h1>
          <p className="text-gray-600 text-lg">Financial overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 250 }}
            className={`rounded-xl px-5 py-4 text-center shadow-md flex flex-col justify-center items-center ${card.bg}`}
          >
            <p className={`text-2xl font-bold mb-1 ${card.text}`}>{card.value}</p>
            <p className="text-sm font-medium text-gray-700">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Monthly Sales</h2>
          <Chart options={salesChart.options} series={salesChart.series} type="area" height={260} />
        </div>
        <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Monthly Expenses</h2>
          <Chart options={expenseChart.options} series={expenseChart.series} type="bar" height={260} />
        </div>
      </div>
    </motion.div>
  );
};

export default SalesExpenseSection;
