import React, { useEffect, useState } from "react";

const MaintenanceUser = ({ children }) => {
  const [status, setStatus] = useState(null);
  const [showMaintenance, setShowMaintenance] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/maintenance/status");
        const data = await res.json();

        if (data.maintenance) {
          setShowMaintenance(true); 
        } else {
          
          setTimeout(() => {
            setShowMaintenance(false);
          }, 3000); 
        }

        setStatus(data);
      } catch (error) {
        console.error("❌ Error fetching maintenance status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); 
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  if (showMaintenance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-yellow-700">
             Maintenance Mode Active
          </h1>
          <p className="text-gray-700 mb-4">
            {status.message ||
              "System is under maintenance. Please check back later."}
          </p>

          {status.showCountdown && status.endTime && (
            <p className="text-sm text-gray-500">
              Expected end:{" "}
              <span className="font-medium text-gray-700">
                {new Date(status.endTime).toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default MaintenanceUser;
