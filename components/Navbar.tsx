
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import Button from './Button';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAdminPanelClick?: () => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
  onHomeClick: () => void;
  categories: string[];
  onOrdersClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user, onLoginClick, onLogoutClick, cartCount, onCartClick,
  searchTerm, onSearchChange, onAdminPanelClick, onCategorySelect,
  selectedCategory, onHomeClick, categories, onOrdersClick
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  return (
    <header className="sticky top-0 z-[60] shadow-sm">
      <div className="bg-slate-950 text-white py-1.5 px-6 text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="truncate">Ak Elite Delivery • Free over ৳5,000</span>
          <div className="hidden sm:flex gap-6">
            <a href="#" className="hover:text-orange-400 transition-colors">Support</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Tracking</a>
          </div>
        </div>
      </div>

      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex justify-between items-center h-20">
          <div className="flex items-center gap-4 md:gap-10">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={onHomeClick}>
              <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-tr from-orange-600 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl shadow-orange-100 group-hover:rotate-6 transition-transform">Ak</div>
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter hidden xs:block">Shop</span>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <button onClick={onHomeClick} className={`${selectedCategory === 'All' ? 'text-orange-600 border-b-2 border-orange-600 pb-1' : 'hover:text-slate-900 transition-colors'}`}>Explore</button>
              
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`flex items-center gap-2 transition-all ${isMenuOpen ? 'text-orange-600' : 'hover:text-slate-900'}`}>
                  Categories <i className="fa-solid fa-chevron-down text-[8px]"></i>
                </button>
                {isMenuOpen && (
                  <div className="absolute left-0 mt-4 w-56 bg-white rounded-[32px] shadow-2xl border border-gray-100 py-4 animate-in zoom-in-95 overflow-hidden">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => { onCategorySelect(cat); setIsMenuOpen(false); }} className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 ${selectedCategory === cat ? 'text-orange-600' : 'text-slate-500 hover:text-orange-600'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 max-w-sm mx-10 hidden md:block">
            <div className="relative group">
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors"></i>
              <input type="text" className="w-full bg-slate-50 pl-14 pr-5 py-3.5 rounded-[20px] outline-none border border-transparent focus:border-orange-100 focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all text-sm font-bold placeholder:text-slate-400" placeholder="Search product vault..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Mobile Search Toggle */}
            <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="md:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:text-orange-600 bg-slate-50 rounded-xl transition-all">
              <i className={`fa-solid ${isMobileSearchOpen ? 'fa-xmark' : 'fa-magnifying-glass'}`}></i>
            </button>

            <button onClick={onCartClick} className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-slate-500 hover:text-orange-600 bg-slate-50 rounded-xl md:rounded-2xl transition-all">
              <i className="fa-solid fa-cart-shopping text-lg md:text-xl"></i>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden ring-2 ring-orange-50 hover:ring-orange-200 transition-all shadow-sm">
                  <img src={user.avatar} className="w-full h-full object-cover" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-64 md:w-72 bg-white rounded-[24px] md:rounded-[32px] shadow-2xl border border-gray-100 p-4 md:p-6 animate-in zoom-in-95">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                      <img src={user.avatar} className="w-10 h-10 rounded-full" />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 leading-none truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Verified Customer</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button onClick={() => { onOrdersClick(); setIsProfileOpen(false); }} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-50 hover:bg-orange-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                         <i className="fa-solid fa-box-archive text-orange-600"></i> My Order Vault
                      </button>
                      {user.isAdmin && <button onClick={() => { onAdminPanelClick?.(); setIsProfileOpen(false); }} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100">Admin Control</button>}
                      <button onClick={onLogoutClick} className="w-full text-center py-3 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors">Secure Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button size="sm" onClick={onLoginClick} className="px-4 md:px-6 rounded-xl md:rounded-[16px] text-xs">Login</Button>
            )}
          </div>
        </div>

        {/* Mobile Search Drawer */}
        {isMobileSearchOpen && (
          <div className="md:hidden w-full px-4 pb-4 animate-in slide-in-from-top duration-300">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                ref={searchInputRef}
                type="text" 
                className="w-full bg-slate-50 pl-11 pr-4 py-3 rounded-xl outline-none border border-orange-100 focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all text-sm font-bold placeholder:text-slate-400" 
                placeholder="Search products..." 
                value={searchTerm} 
                onChange={e => onSearchChange(e.target.value)} 
              />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
