import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react"; // install via: npm i lucide-react

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]); // [{id, message, type, exiting}]
  const timers = useRef({});

  // clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const removeToast = useCallback((id) => {
    // trigger exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      if (timers.current[id]) {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
      }
    }, 260); // matches CSS exit duration
  }, []);

  const showToast = useCallback(
    (message, type = "info", { duration = 4000 } = {}) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 8);
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      timers.current[id] = setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const pauseTimer = (id) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  const resumeTimer = (id, remaining = 3000) => {
    if (!timers.current[id]) {
      timers.current[id] = setTimeout(() => removeToast(id), remaining);
    }
  };

  const renderIcon = (type) => {
    if (type === "success") return <CheckCircle size={18} className="text-green-400" />;
    if (type === "error") return <XCircle size={18} className="text-red-400" />;
    return <Info size={18} className="text-blue-400" />;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-3"
        aria-live="polite"
        aria-atomic="true"
      >

        {toasts.map((t) => (
          <div
            key={t.id}
            onMouseEnter={() => pauseTimer(t.id)}
            onMouseLeave={() => resumeTimer(t.id, 2000)}
            className={
                "max-w-md w-full px-5 py-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-xl flex items-start gap-4 text-[15px] " +
                (t.exiting ? "animate-toast-out" : "animate-toast-in")
            }
            role="status"
          >
            <div className="mt-0.5">{renderIcon(t.type)}</div>

            <div className="flex-1">
              <div className="text-sm font-medium">{t.message}</div>
            </div>

            <button
              aria-label="Close notification"
              onClick={() => removeToast(t.id)}
              className="opacity-70 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook for using toast anywhere
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
