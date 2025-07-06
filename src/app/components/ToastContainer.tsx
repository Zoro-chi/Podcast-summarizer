import React from "react";

interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<Toast> = ({ id, message, type, onClose }) => {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      case "info":
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-md shadow-lg max-w-sm animate-slide-in ${getTypeStyles()}`}
    >
      <span className="text-lg">{getIcon()}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-lg hover:opacity-75 transition-opacity"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default ToastContainer;
