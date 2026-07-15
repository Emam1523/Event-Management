import { useState } from 'react';
import { FiBell } from 'react-icons/fi';

const NotificationBell = ({ count = 0, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (count > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
      aria-label="Notifications"
    >
      <FiBell className={`text-xl ${isAnimating ? 'animate-bounce' : ''}`} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-5">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
