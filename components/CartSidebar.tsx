
import React from 'react';
import { CartItem } from '../types';
import Button from './Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  onCheckout
}) => {
  const total = items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform animate-in slide-in-from-right duration-300">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-8 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-bag-shopping text-orange-600 text-xl"></i>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Shopping Bag</h2>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 py-8 overflow-y-auto px-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6 text-slate-200 text-4xl">
                    <i className="fa-solid fa-cart-arrow-down"></i>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Your bag is empty</h3>
                  <p className="mt-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Discover our curated collection</p>
                  <Button variant="outline" className="mt-10 h-14 rounded-2xl px-10 text-[10px] uppercase tracking-widest" onClick={onClose}>Start Shopping</Button>
                </div>
              ) : (
                <div className="space-y-10">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-slate-50 p-2 group-hover:border-orange-200 transition-all">
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-black text-slate-900 line-clamp-1 flex-1 leading-tight">{item.name}</h3>
                            <p className="ml-4 text-sm font-black text-slate-900">৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                          </div>
                          <p className="mt-1 text-[9px] font-black text-orange-600 uppercase tracking-widest">{item.category}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between">
                          <div className="flex items-center bg-slate-50 rounded-xl border border-gray-100 overflow-hidden scale-90 -ml-2">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-10 h-10 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all text-slate-400 font-bold"
                            ><i className="fa-solid fa-minus text-[10px]"></i></button>
                            <span className="w-10 text-center font-black text-[11px] text-slate-900">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all text-slate-400 font-bold"
                            ><i className="fa-solid fa-plus text-[10px]"></i></button>
                          </div>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                          >Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-8 py-10 space-y-6 bg-white shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cart Subtotal</span>
                  <span className="text-2xl font-black text-slate-900">৳{total.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl flex items-center gap-4">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center"><i className="fa-solid fa-truck-fast"></i></div>
                  <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Free Shipping Active</p>
                </div>
                <Button fullWidth className="h-16 rounded-[20px] text-[11px] uppercase tracking-widest" onClick={onCheckout}>Proceed to Secure Checkout</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
