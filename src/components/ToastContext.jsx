import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

const TYPE_STYLES = {
  success: { bar: "#22c55e", icon: "✓" },
  error:   { bar: "#ef4444", icon: "✕" },
  warning: { bar: "#f97316", icon: "!" },
  info:    { bar: "#3b82f6", icon: "i" },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container — bottom-right, compact */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[99999] pointer-events-none">
        {toasts.map(toast => {
          const s = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
          return (
            <div
              key={toast.id}
              className="flex items-center gap-2.5 bg-[rgb(55,60,66)] rounded-lg shadow-lg overflow-hidden"
              style={{ minWidth: 180, maxWidth: 300 }}
            >
              {/* Colored left bar */}
              <div style={{ width: 3, alignSelf: 'stretch', backgroundColor: s.bar, flexShrink: 0 }} />

              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 18, height: 18, backgroundColor: s.bar, fontSize: 10, fontWeight: 700, color: 'white' }}
              >
                {s.icon}
              </div>

              {/* Message */}
              <span className="text-white text-xs font-medium py-2.5 pr-3 leading-tight">
                {toast.message}
              </span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
