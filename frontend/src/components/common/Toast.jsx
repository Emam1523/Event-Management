import { useEffect, useState, useCallback } from "react";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

const Toast = ({
  title = null,
  message,
  type = "info",
  duration = 4000,
  onClose,
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const icons = {
    success: <FiCheck className="text-green-500" />,
    error: <FiX className="text-red-500" />,
    warning: <FiAlertCircle className="text-yellow-500" />,
    info: <FiInfo className="text-blue-500" />,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    static: "",
  };

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`${
        position === "static" ? "relative" : "fixed"
      } z-50 ${positions[position]} transition-all duration-300 ${
        isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${colors[type]} max-w-sm`}
      >
        <div className="shrink-0">{icons[type]}</div>
        <div className="min-w-0 flex-1">
          {title && <p className="text-sm font-semibold">{title}</p>}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
        >
          <FiX className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
