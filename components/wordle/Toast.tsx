import React from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded-md shadow-lg transition-opacity duration-300 animate-fade-in-out">
      {message}
    </div>
  );
};

export default Toast; 