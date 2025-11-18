import React from 'react';
import {
  Home,
  UserCog,
  Settings,
  RefreshCcw,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../../assets/ICONS.png';

const Navigation = ({ selectedSection, setSelectedSection, handleLogout }) => {
  const NavItem = ({ icon, label, onClick, active }) => (
    <motion.div
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-xl transition ${
        active ? 'bg-white/10' : ''
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="font-semibold tracking-wide text-sm">{label}</span>
    </motion.div>
  );

  return (
    <motion.aside
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-64 bg-[#243b7d] text-white flex flex-col items-center py-6 shadow-xl rounded-r-3xl sticky top-0 h-screen"
    >
      <motion.img
        src={logo}
        alt="Logo"
        className="w-20 mb-6"
        whileHover={{ scale: 1.1 }}
      />
      <nav className="space-y-3 w-full px-6">
        <NavItem
          icon={<Home size={18} />}
          label="Dashboard"
          active={selectedSection === 'overview'}
          onClick={() => setSelectedSection('overview')}
        />
        <NavItem
          icon={<UserCog size={18} />}
          label="Manage user"
          active={selectedSection === 'manageUser'}
          onClick={() => setSelectedSection('manageUser')}
        />
        <NavItem
          icon={<RefreshCcw size={18} />}
          label="Backup & Restore"
          active={selectedSection === 'backup'}
          onClick={() => setSelectedSection('backup')}
        />
        <NavItem
          icon={<BarChart3 size={18} />}
          label="Sales & Expense"
          active={selectedSection === 'sales'}
          onClick={() => setSelectedSection('sales')}
        />
        <NavItem
          icon={<LogOut size={18} />}
          label="Log-out"
          onClick={handleLogout}
        />
      </nav>
    </motion.aside>
  );
};

export default Navigation;
