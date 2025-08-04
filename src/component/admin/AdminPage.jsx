import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navigation from './Navigation';
import OverviewSection from './OverviewSection';
import ManageUserSection from './ManageUserSection';
import Maintenance from './Maintenance';
import BackupRestoreSection from './BackupRestoreSection';
import SalesExpenseSection from './SalesExpenseSection';

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('overview');

  // Load section from localStorage on mount
  useEffect(() => {
    const savedSection = localStorage.getItem('adminSelectedSection');
    if (savedSection) setSelectedSection(savedSection);
  }, []);

  // Save section to localStorage whenever it changes
  const handleSectionChange = (section) => {
    setSelectedSection(section);
    localStorage.setItem('adminSelectedSection', section);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#e1e7f0] text-gray-800 font-sans">
      <Navigation
        selectedSection={selectedSection}
        setSelectedSection={handleSectionChange}
        handleLogout={handleLogout}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedSection === 'overview' && <OverviewSection />}
        {selectedSection === 'manageUser' && <ManageUserSection />}
        {selectedSection === 'maintenance' && <Maintenance />}
        {selectedSection === 'backup' && <BackupRestoreSection />}
        {selectedSection === 'sales' && <SalesExpenseSection />}
      </main>
    </div>
  );
};

export default AdminPage;
