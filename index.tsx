
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Product, CartItem, User, Review, ShopSettings, Order } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';
import ProductDetailModal from './components/ProductDetailModal';
import Toast from './components/Toast';
import Button from './components/Button';

type View = 'shop' | 'admin';

const App = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ak_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('ak_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('ak_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ak_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ak_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentView, setCurrentView] = useState<View>('shop');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  useEffect(() => localStorage.setItem('ak_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('ak_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('ak_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('ak_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('ak_cart', JSON.stringify(cart)), [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  const addToCart = (product: Product, selectedOptions?: Record<string, string>) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedOptions }];
    });
    setToastMessage(`${product.name} added to bag!`);
    setIsToastVisible(true);
  };

  const handleLogin = (name: string, email: string, password?: string): boolean => {
    const isAdminEmail = email.toLowerCase() === 'admin@akshop.com';
    const currentAdminPass = settings.adminPassword || 'admin123';
    
    if (isAdminEmail) {
      if (password === currentAdminPass) {
        const adminUser: User = {
          id: 'admin-id',
          name,
          email: email.toLowerCase(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
          isAdmin: true
        };
        setUser(adminUser);
        setCurrentView('admin');
        return true;
      } else {
        alert("Admin Password Incorrect.");
        return false;
      }
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email: email.toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        isAdmin: false
      };
      setUser(newUser);
      return true;
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      userName: user.name,
      userEmail: user.email,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0),
      date: new Date().toLocaleString(),
      status: 'Pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setToastMessage("Order confirmed! View in Profile.");
    setIsToastVisible(true);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('shop');
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addCategory = (cat: string) => {
    if (!categories.includes(cat)) {
      setCategories(prev => [...prev, cat]);
    }
  };

  const deleteCategory = (cat: string) => {
    if (cat === 'All') return;
    setCategories(prev => prev.filter(c => c !== cat));
    if (selectedCategory === cat) setSelectedCategory('All');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const userOrders = useMemo(() => orders.filter(o => o.userEmail === user?.email), [orders, user]);

  if (currentView === 'admin' && user?.isAdmin) {
    return (
      <AdminPanel 
        products={products}
        categories={categories}
        settings={settings}
        orders={orders}
        users={[]}
        onDeleteUser={() => {}} 
        onUpdateSettings={setSettings}
        onAddProduct={(p) => setProducts(prev => [p, ...prev])}
        onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onExit={() => setCurrentView('shop')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-orange-100 text-[13px]">
      <div className="bg-slate-900 py-1.5 px-4 text-center text-[9px] font-black tracking-widest uppercase text-white shadow-lg relative z-[70]">
        Secure Payments • Use <span className="text-orange-500 underline underline-offset-2">AK-ELITE</span> for 5% Discount
      </div>

      <Navbar 
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAdminPanelClick={() => setCurrentView('admin')}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        onHomeClick={handleReset}
        categories={categories}
        onOrdersClick={() => setIsOrderHistoryOpen(true)}
      />

      <main className="flex-grow">
        <Hero />

        <section className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-2.5 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
             <div className="flex items-center gap-2 py-1 min-w-max md:min-w-0 md:justify-center">
               {categories.map((cat) => (
                 <button 
                  key={cat}
                  onClick={() => { 
                    setSelectedCategory(cat); 
                    const shopSection = document.getElementById('shop-section');
                    if (shopSection) {
                      const offset = 140;
                      const elementPosition = shopSection.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    selectedCategory === cat 
                    ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-100' 
                    : 'bg-white border-gray-100 text-slate-400 hover:text-orange-600 hover:border-orange-100'
                  }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>
        </section>

        <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-50 text-orange-600 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.3em]">Curated Vault</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none">
                {selectedCategory === 'All' ? 'Signature Collection' : `${selectedCategory} Essentials`}
              </h2>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  settings={settings}
                  onAddToCart={(p) => addToCart(p)}
                  onProductClick={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 md:py-32 bg-slate-50 rounded-[32px] md:rounded-[48px] border-2 border-dashed border-gray-200 px-4">
              <i className="fa-solid fa-cloud-moon text-orange-200 text-4xl md:text-5xl mb-6 animate-pulse"></i>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">End of the line</h3>
              <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-widest">No results found for current filters</p>
              <button onClick={handleReset} className="mt-8 md:mt-10 px-8 md:px-10 py-3 md:py-4 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95">Clear Filters</button>
            </div>
          )}
        </div>

        <section className="bg-slate-950 py-16 md:py-24 text-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center md:text-left">
            <div className="animate-in fade-in duration-500">
               <div className="flex items-center gap-3 mb-6 md:mb-8 justify-center md:justify-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl shadow-xl shadow-orange-900/20">Ak</div>
                  <span className="text-2xl md:text-3xl font-black tracking-tighter">Ak Shop</span>
               </div>
               <p className="text-slate-400 font-medium leading-relaxed mb-8 md:mb-10 text-xs md:text-sm">Providing exceptional curated items for discerning customers worldwide. Quality isn't a goal; it's our minimum standard.</p>
               <div className="flex gap-4 justify-center md:justify-start">
                  <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/5"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/5"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#" className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/5"><i className="fa-brands fa-linkedin-in"></i></a>
               </div>
            </div>
            <div className="hidden md:block">
               <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 mb-10">Resources</h4>
               <ul className="space-y-5 text-sm font-bold text-slate-400">
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2" onClick={handleReset}><i className="fa-solid fa-circle text-[4px]"></i> Signature Collection</li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2" onClick={() => setIsOrderHistoryOpen(true)}><i className="fa-solid fa-circle text-[4px]"></i> Shipping Tracking</li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"><i className="fa-solid fa-circle text-[4px]"></i> Returns & Policy</li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"><i className="fa-solid fa-circle text-[4px]"></i> Become a Partner</li>
               </ul>
            </div>
            <div>
               <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 mb-8 md:mb-10">Direct Support</h4>
               <p className="text-slate-400 text-xs md:text-sm font-medium mb-6 md:mb-8">Our support team is active 24/7 to handle your elite requests.</p>
               <div className="space-y-4">
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="flex items-center gap-4 text-xs md:text-sm font-black hover:text-orange-500 transition-colors group justify-center md:justify-start">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                      <i className="fa-brands fa-whatsapp text-lg text-green-500 group-hover:text-white"></i>
                    </div>
                    <span>{settings.whatsapp}</span>
                  </a>
                  <div className="flex items-center gap-4 text-xs md:text-sm font-black group justify-center md:justify-start">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <i className="fa-solid fa-envelope text-lg text-orange-500 group-hover:text-white"></i>
                    </div>
                    <span>{settings.email}</span>
                  </div>
               </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-16 md:mt-24 pt-8 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
             <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">© 2024 Ak Shop Elite. Handcrafted for excellence.</p>
             <div className="flex gap-6 md:gap-8 text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">GDRP</a>
             </div>
          </div>
        </section>
      </main>

      {/* User Order History Modal */}
      {isOrderHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => setIsOrderHistoryOpen(false)} />
           <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl w-full max-w-2xl p-6 md:p-10 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 md:mb-8 border-b pb-4 md:pb-6">
                 <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                    <i className="fa-solid fa-box-open text-orange-600"></i> Purchasing History
                 </h2>
                 <button onClick={() => setIsOrderHistoryOpen(false)} className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                    <i className="fa-solid fa-xmark"></i>
                 </button>
              </div>

              {!user ? (
                <div className="text-center py-10 md:py-16">
                   <p className="text-slate-400 font-black uppercase text-[10px] md:text-[11px] tracking-widest mb-6">Security Access Required</p>
                   <Button size="lg" className="rounded-2xl" onClick={() => { setIsOrderHistoryOpen(false); setIsAuthModalOpen(true); }}>Sign In to View</Button>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-10 md:py-16">
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-[24px] md:rounded-[32px] flex items-center justify-center text-slate-200 text-2xl md:text-3xl mx-auto mb-6">
                      <i className="fa-solid fa-receipt"></i>
                   </div>
                   <p className="text-slate-400 font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em]">No orders recorded</p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                   {userOrders.map(order => (
                     <div key={order.id} className="bg-slate-50 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-slate-100 hover:shadow-lg hover:bg-white transition-all">
                        <div className="flex justify-between items-start mb-4 md:mb-6">
                           <div>
                              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{order.date}</p>
                              <p className="text-sm md:text-base font-black text-slate-900 mt-1">{order.id}</p>
                           </div>
                           <span className="bg-orange-600 text-white text-[8px] md:text-[9px] font-black uppercase px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-xl shadow-orange-900/10">{order.status}</span>
                        </div>
                        <div className="space-y-2 md:space-y-3 border-t border-slate-200/50 pt-4 md:pt-5">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="flex justify-between text-[11px] md:text-[12px] font-bold text-slate-600">
                                <div className="flex flex-col">
                                  <span>{item.quantity}x {item.name}</span>
                                  {item.selectedOptions && Object.entries(item.selectedOptions).map(([k, v]) => (
                                    <span key={k} className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase">{k}: {v}</span>
                                  ))}
                                </div>
                                <span className="text-slate-900">৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                             </div>
                           ))}
                        </div>
                        <div className="flex justify-between items-center mt-4 md:mt-6 pt-4 md:pt-5 border-t border-slate-200">
                           <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Total</span>
                           <span className="text-lg md:text-xl font-black text-slate-900">৳{order.total.toLocaleString()}</span>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      )}

      <CartSidebar 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
        items={cart} onRemove={(id) => setCart(prev => prev.filter(item => item.id !== id))}
        onUpdateQuantity={(id, qty) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item))}
        onCheckout={handleCheckout}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct} user={user}
          settings={settings}
          isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, opts) => { addToCart(p, opts); setSelectedProduct(null); }}
          onSubmitReview={(pid, r, c) => {
            const updatedProducts = products.map(p => {
               if(p.id === pid) {
                 const newRev: Review = { id: Math.random().toString(), userId: user?.id || 'v', userName: user?.name || 'Visitor', rating: r, comment: c, date: new Date().toLocaleDateString() };
                 return { ...p, reviews: [newRev, ...(p.reviews || [])], reviewsCount: (p.reviewsCount || 0) + 1 };
               }
               return p;
            });
            setProducts(updatedProducts);
            setSelectedProduct(null);
            setToastMessage("Review posted! Thank you.");
            setIsToastVisible(true);
          }}
        />
      )}

      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} onViewCart={() => { setIsToastVisible(false); setIsCartOpen(true); }} />
      <ChatBot products={products} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
