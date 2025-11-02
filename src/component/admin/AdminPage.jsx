import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navigation from "./Navigation";
import OverviewSection from "./OverviewSection";
import ManageUserSection from "./ManageUserSection";
import Maintenance from "./Maintenance";
import BackupRestoreSection from "./BackupRestoreSection";
import SalesExpenseSection from "./SalesExpenseSection";

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("overview");

  useEffect(() => {
    const savedSection = localStorage.getItem("adminSelectedSection");
    if (savedSection) setSelectedSection(savedSection);
  }, []);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    localStorage.setItem("adminSelectedSection", section);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full text-gray-900 font-sans bg-white">
      {/* Sidebar */}
      <Navigation
        selectedSection={selectedSection}
        setSelectedSection={handleSectionChange}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {selectedSection === "overview" && (
          <div className="p-8 rounded-3xl bg-white shadow-2xl space-y-8 min-h-screen">
            <OverviewSection />
          </div>
        )}

        {selectedSection === "manageUser" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white shadow-2xl space-y-6 min-h-screen"
          >
            <ManageUserSection />
          </motion.div>
        )}

        {selectedSection === "maintenance" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white shadow-2xl space-y-6 min-h-screen"
          >
            <Maintenance />
          </motion.div>
        )}

        {selectedSection === "backup" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white shadow-2xl space-y-6 min-h-screen"
          >
            <BackupRestoreSection />
          </motion.div>
        )}

        {selectedSection === "sales" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white shadow-2xl space-y-6 min-h-screen"
          >
            <SalesExpenseSection />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
