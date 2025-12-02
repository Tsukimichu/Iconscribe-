const MaintenanceLock = ({ message, endTime, showCountdown }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold text-yellow-600 mb-2">🚧 System Maintenance</h1>
      <p className="text-gray-700 max-w-md">{message || "We are currently undergoing maintenance."}</p>

      {showCountdown && endTime && (
        <p className="mt-4 text-sm text-gray-600">
          Expected finish: <b>{new Date(endTime).toLocaleString()}</b>
        </p>
      )}
    </div>
  );
};

export default MaintenanceLock;
