import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  UserCog,
  Settings,
  RefreshCcw,
  BarChart3,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import Chart from 'react-apexcharts';
import logo from '../../assets/ICONS.png';

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('overview');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-white text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#243b7d] text-white flex flex-col items-center py-6 drop-shadow-lg">
        <img src={logo} alt="Logo" className="w-20 mb-6" />
        <nav className="space-y-3 w-full px-6">
          <NavItem icon={<Home size={18} />} label="Overview" onClick={() => setSelectedSection('overview')} />
          <NavItem icon={<UserCog size={18} />} label="Manage user" onClick={() => setSelectedSection('manageUser')} />
          <NavItem icon={<Settings size={18} />} label="Maintenance" />
          <NavItem icon={<RefreshCcw size={18} />} label="Backup & Restore" />
          <NavItem icon={<BarChart3 size={18} />} label="Sales & Expense" />
          <NavItem icon={<LogOut size={18} />} label="Log-out" onClick={handleLogout} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedSection === 'overview' && <OverviewSection />}
        {selectedSection === 'manageUser' && <ManageUserSection />}
      </main>
    </div>
  );
};

// Sidebar Button
function NavItem({ icon, label, onClick }) {
  return (
    <div
      className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 p-2 rounded-xl transition"
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

// Dashboard Overview Section
function OverviewSection() {
  const orderOptions = {
    chart: { id: 'line-chart', toolbar: { show: false } },
    xaxis: { categories: ['Official Receipt', 'Calendar', 'Yearbook', 'Book', 'Mug'] },
    stroke: { curve: 'smooth' },
    colors: ['#4f46e5', '#06b6d4', '#facc15', '#f97316'],
  };

  const orderSeries = [
    { name: 'Jan', data: [120, 60, 30, 90, 40] },
    { name: 'Feb', data: [90, 80, 45, 100, 35] },
    { name: 'Mar', data: [130, 85, 50, 70, 45] },
    { name: 'Apr', data: [110, 70, 60, 65, 50] },
  ];

  const salesSeries = [{ name: 'Total Sales', data: [200, 150, 100, 120, 80] }];

  const salesOptions = {
    chart: { id: 'bar-chart', toolbar: { show: false } },
    xaxis: { categories: ['Official Receipt', 'Calendar', 'Yearbook', 'Book', 'Mug'] },
    colors: ['#4f46e5'],
  };

  const statusCards = [
    { label: 'In review', value: 6 },
    { label: 'Ongoing', value: 1 },
    { label: 'Pending', value: 1 },
    { label: 'Out for Delivery', value: 1 },
    { label: 'Completed', value: 7 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <h1 className="text-3xl font-extrabold text-[#243b7d] mb-1">Admin Dashboard</h1>
      <p className="text-lg text-gray-500 mb-6">Hello Admin 👋</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statusCards.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl ring-1 ring-gray-200 shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="text-3xl font-bold text-[#243b7d]">{item.value.toString().padStart(2, '0')}</p>
            <p className="text-xs text-gray-400">Month of April</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Total Orders">
          <Chart options={orderOptions} series={orderSeries} type="line" height={250} />
        </ChartCard>

        <ChartCard title="Total Sales">
          <Chart options={salesOptions} series={salesSeries} type="bar" height={250} />
        </ChartCard>
      </div>
    </motion.div>
  );
}

// Chart Card Component
function ChartCard({ title, children }) {
  return (
    <motion.div
      className="bg-white/60 backdrop-blur-md p-5 rounded-2xl ring-1 ring-gray-200 shadow transition"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-3 text-[#243b7d]">{title}</h2>
      {children}
    </motion.div>
  );
}

// Manage User Section
function ManageUserSection() {
  const [users, setUsers] = useState([
    { id: '001', name: 'Aldrin Portento', email: 'Aldrin@gmail.com', contact: '09098765453', status: 'Active' },
    { id: '002', name: 'Dave Geroleo', email: 'Dave@gmail.com', contact: '09098765453', status: 'Active' },
    { id: '003', name: 'Carl Madrigal', email: 'Carl@gmail.com', contact: '09098765453', status: 'Active' },
    { id: '004', name: 'Mark Meñiring', email: 'Mark@gmail.com', contact: '09098765453', status: 'Suspended' },
    { id: '005', name: 'Jabiel Medroño', email: 'jabiel@gmail.com', contact: '09098765453', status: 'Inactive' },
    { id: '006', name: 'James Palma', email: 'James@gmail.com', contact: '09098765453', status: 'Banned' },
  ]);

  const statusColor = {
    Active: 'bg-green-100 text-green-600',
    Suspended: 'bg-yellow-100 text-yellow-700',
    Inactive: 'bg-gray-200 text-gray-500',
    Banned: 'bg-red-100 text-red-600',
  };

  const updateStatus = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h1 className="text-3xl font-bold text-[#243b7d] mb-6">Manage Users</h1>

      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow ring-1 ring-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">User List</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#243b7d] text-white rounded-xl hover:bg-[#1f2f63] transition">
            <SlidersHorizontal size={16} />
            Sort Items
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 rounded-t-xl text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">User ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/30 transition">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.contact}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColor[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {user.status !== 'Active' && (
                      <button
                        onClick={() => updateStatus(user.id, 'Active')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition"
                      >
                        Activate
                      </button>
                    )}
                    {user.status === 'Active' && (
                      <button
                        onClick={() => updateStatus(user.id, 'Suspended')}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs rounded-lg transition"
                      >
                        Suspend
                      </button>
                    )}
                    {user.status !== 'Banned' && (
                      <button
                        onClick={() => updateStatus(user.id, 'Banned')}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition"
                      >
                        Ban
                      </button>
                    )}
                    {user.status === 'Banned' && (
                      <button
                        onClick={() => updateStatus(user.id, 'Active')}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition"
                      >
                        Unban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminPage;
