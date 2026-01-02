
import React, { useState } from 'react';
import Button from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string, password?: string) => boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      const success = onLogin(name, email, password);
      if (success) {
        onClose();
      }
    }
  };

  const isAdminEmail = email.toLowerCase() === 'admin@akshop.com';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-black mx-auto mb-3 shadow-xl shadow-orange-100">
            Ak
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Access Vault</h2>
          <p className="text-gray-500 mt-1 text-[11px] font-medium">Identify yourself to proceed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50/50 font-bold text-[12px]"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50/50 font-bold text-[12px]"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {isAdminEmail && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-[8px] font-black text-orange-600 uppercase tracking-widest mb-1 ml-1">Admin Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white font-bold text-[12px]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[9px] text-orange-500 mt-2 font-bold italic">* Use default 'admin123' if first time</p>
            </div>
          )}

          <Button fullWidth type="submit" className="mt-4 h-12 rounded-xl text-[9px] uppercase tracking-widest">
            {isAdminEmail ? 'Admin Secure Login' : 'Continue to Shop'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
