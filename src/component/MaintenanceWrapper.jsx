import React, { useEffect, useState } from "react";
import { API_URL } from "../api.js";
import { useAuth } from "../context/authContext.jsx";
import MaintenanceLock from "./MaintenanceLock.jsx";

const MaintenanceWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const { user } = useAuth();

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/maintenance/status`);
      const data = await res.json();
      setMaintenanceData(data);
    } catch (err) {
      console.error("Maintenance fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();                       

    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onUpdate = () => fetchStatus();
    window.addEventListener("maintenance-updated", onUpdate);
    return () => window.removeEventListener("maintenance-updated", onUpdate);
  }, []);

  // Admin or manager can bypass maintenance
  const canBypass =
    user?.role === "admin" || user?.role === "manager";

  const isMaintenance = maintenanceData?.maintenance;

  if (loading) return null;

  if (isMaintenance && !canBypass) {
    return (
      <MaintenanceLock
        message={maintenanceData.message}
        endTime={maintenanceData.end_time}
        showCountdown={maintenanceData.show_countdown}
      />
    );
  }

  return children;
};

export default MaintenanceWrapper;
