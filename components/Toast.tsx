
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  onViewCart: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, onViewCart }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right-10 duration-300">
      <div className="bg-white border border-orange-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
        <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
          <i className="fa-solid fa-check"></i>
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-slate-900">{message}</p>
          <button 
            onClick={onViewCart}
            className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-800 transition-colors mt-0.5"
          >
            View Cart →
          </button>
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;
