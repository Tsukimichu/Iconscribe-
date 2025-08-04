import React from 'react';

const OverviewSection = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Manager Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-900 mt-2">124</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Pending Orders</h2>
          <p className="text-3xl font-bold text-yellow-500 mt-2">17</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Completed Sales</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">₱58,300</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Activity</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ Order #1032 marked as completed</li>
          <li>• Supply inventory updated</li>
          <li>• New design uploaded for brochure printing</li>
          <li>✓ Order #1028 picked up by client</li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewSection;
