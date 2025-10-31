import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import OverviewSection from './OverviewSection';
import OrdersSection from './OrdersSection';
import ProductSection from './ProductSection';
import SupplySection from './SupplySection';
import SalesAndExpenseSection from './SalesAndExpenseSection';
import ArchiveSection from './ArchiveSection';
import ManagerChatPanel from "./ManagerChatPanel";

const ManagerPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('overview');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#e1e7f0] text-gray-800 font-sans">
      <Navigation
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        handleLogout={handleLogout}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedSection === 'overview' && <OverviewSection />}
        {selectedSection === 'orders' && <OrdersSection />}
        {selectedSection === 'products' && <ProductSection />}
        {selectedSection === 'supply' && <SupplySection />}
        {selectedSection === 'salesExpense' && <SalesAndExpenseSection />}
        {selectedSection === 'archive' && <ArchiveSection />}
        {selectedSection === "chat" && <ManagerChatPanel />}
      </main>
    </div>
  );
};

export default ManagerPage;
