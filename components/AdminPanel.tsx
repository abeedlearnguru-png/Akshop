
import React, { useState, useRef } from 'react';
import { Product, ShopSettings, Order, User } from '../types';
import Button from './Button';

interface AdminPanelProps {
  products: Product[];
  categories: string[];
  settings: ShopSettings;
  orders: Order[];
  users: User[];
  onDeleteUser: (id: string) => void;
  onUpdateSettings: (settings: ShopSettings) => void;
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  categories, 
  settings,
  orders,
  users,
  onDeleteUser,
  onUpdateSettings,
  onAddProduct, 
  onDeleteProduct, 
  onAddCategory, 
  onDeleteCategory,
  onExit 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'settings' | 'orders' | 'users'>('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<ShopSettings>(settings);
  const [newPass, setNewPass] = useState('');
  const [newCatName, setNewCatName] = useState('');
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const mockupImageInputRef = useRef<HTMLInputElement>(null);

  const [featuresText, setFeaturesText] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    discountPrice: undefined,
    category: categories[1] || 'Electronics',
    description: '',
    image: '',
    mockupImage: '',
    imageFit: 'contain',
    isFeatured: false,
    options: []
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'mockupImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image || !newProduct.name || !newProduct.price) {
      alert("Please upload a product photo and fill all details!");
      return;
    }
    
    // Process features text into array
    const features = featuresText.split(',').map(f => f.trim()).filter(f => f !== '');

    const product: Product = {
      ...newProduct as Product,
      id: `P-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      rating: 5.0,
      reviewsCount: 0,
      features: features
    };
    onAddProduct(product);
    setIsAdding(false);
    setNewProduct({ name: '', price: 0, category: categories[1] || 'Electronics', description: '', image: '', mockupImage: '', imageFit: 'contain', isFeatured: false, options: [] });
    setFeaturesText('');
    alert('Success! Product is now live in the shop.');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
      alert(`Category "${newCatName}" added!`);
    }
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = { ...tempSettings };
    if (newPass.trim()) {
      updatedSettings.adminPassword = newPass;
    }
    onUpdateSettings(updatedSettings);
    setNewPass('');
    alert('Shop settings updated successfully!');
  };

  const navItems = [
    { id: 'dashboard', label: 'Summary', icon: 'fa-chart-line' },
    { id: 'orders', label: 'Orders', icon: 'fa-receipt' },
    { id: 'products', label: 'Inventory', icon: 'fa-box' },
    { id: 'categories', label: 'Categories', icon: 'fa-tags' },
    { id: 'users', label: 'Members', icon: 'fa-users' },
    { id: 'settings', label: 'Settings', icon: 'fa-gears' },
  ] as const;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-[12px]">
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center font-black text-lg shadow-xl">Ak</div>
            <div>
              <span className="text-sm font-black tracking-tight block">Ak Admin</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Store Management</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className={`fa-solid ${item.icon} w-4`}></i> <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-all font-black uppercase text-[9px] tracking-widest group bg-slate-800/50 rounded-xl">
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform text-orange-500"></i> Back to Shop
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-slate-900">
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h1>
          </div>
          {activeTab === 'products' && (
            <Button onClick={() => setIsAdding(true)} size="sm" className="rounded-xl h-10 px-4 md:px-6 text-[10px] uppercase tracking-widest">
              <i className="fa-solid fa-plus mr-2"></i> <span className="hidden xs:inline">Add New Item</span><span className="xs:hidden">Add</span>
            </Button>
          )}
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Live Products</p>
                <p className="text-2xl font-black text-slate-900">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Queue Orders</p>
                <p className="text-2xl font-black text-slate-900">{orders.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Registered</p>
                <p className="text-2xl font-black text-slate-900">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                <p className="text-[8px] font-black text-orange-600 uppercase mb-1">Gross Sales</p>
                <p className="text-2xl font-black text-slate-900">৳{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 text-[9px] uppercase font-black text-slate-400 border-b">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer Info</th>
                    <th className="p-4">Purchase Value</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {orders.length > 0 ? orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-black">{order.id}</td>
                      <td className="p-4"><span className="font-bold">{order.userName}</span><br/><span className="text-[10px] opacity-60">{order.userEmail}</span></td>
                      <td className="p-4 font-bold">৳{order.total.toLocaleString()}</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[8px] font-black uppercase tracking-widest">{order.status}</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-slate-400 font-bold italic">No orders received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="max-w-xl bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-folder-plus text-orange-600"></i> Create New Category
                </h3>
                <form onSubmit={handleAddCategory} className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Category Name (e.g. Shoes, Toys)" 
                    className="flex-1 px-5 py-3.5 bg-gray-50 border rounded-2xl outline-none font-bold text-[12px] focus:ring-2 focus:ring-orange-500/20"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="h-14 rounded-2xl px-8 uppercase text-[10px] tracking-widest">Add</Button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border shadow-sm p-6 md:p-8">
                <h3 className="text-lg font-black text-slate-900 mb-6">Current Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categories.map(cat => (
                    <div key={cat} className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl border hover:border-orange-200 transition-all">
                      <span className="font-black text-slate-700 uppercase tracking-widest text-[9px]">{cat}</span>
                      {cat !== 'All' && (
                        <button onClick={() => onDeleteCategory(cat)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <i className="fa-solid fa-circle-xmark"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} className="w-8 h-8 rounded-full border bg-slate-50" />
                    <div>
                      <p className="font-black text-slate-900">{u.name}</p>
                      <p className="text-[9px] opacity-50 uppercase font-bold">{u.isAdmin ? 'Site Admin' : 'Store Member'}</p>
                    </div>
                  </div>
                  {!u.isAdmin && (
                    <button onClick={() => onDeleteUser(u.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors"><i className="fa-solid fa-user-minus"></i></button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
              <form onSubmit={handleSettingsSave} className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-orange-600"></i> Administration Settings
                </h3>
                <div>
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Update Admin Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none font-bold text-[11px] focus:ring-2 focus:ring-orange-500/20" value={newPass} onChange={e => setNewPass(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">WhatsApp Contact</label>
                    <input className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold text-[11px] outline-none" value={tempSettings.whatsapp} onChange={e => setTempSettings({...tempSettings, whatsapp: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Telegram Contact</label>
                    <input className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold text-[11px] outline-none" value={tempSettings.telegram} onChange={e => setTempSettings({...tempSettings, telegram: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" fullWidth className="h-12 rounded-xl text-[10px] uppercase tracking-widest">Apply Configuration</Button>
              </form>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-50 text-[9px] uppercase font-black text-slate-400 border-b">
                  <tr>
                    <th className="p-4">Visual</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 object-contain rounded border bg-slate-50" />
                        {p.isFeatured && <span className="bg-orange-500 text-white text-[7px] font-black uppercase px-1 rounded">Featured</span>}
                      </td>
                      <td className="p-4 font-bold">{p.name}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                           {p.discountPrice ? (
                             <>
                               <span className="font-black text-slate-900">৳{p.discountPrice.toLocaleString()}</span>
                               <span className="text-[9px] text-slate-400 line-through">৳{p.price.toLocaleString()}</span>
                             </>
                           ) : (
                             <span className="font-black text-slate-900">৳{p.price.toLocaleString()}</span>
                           )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button onClick={() => onDeleteProduct(p.id)} className="text-red-500 hover:scale-110 transition-transform p-2"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAdding(false)} />
          <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-2xl w-full max-w-2xl p-6 md:p-8 relative animate-in zoom-in-95 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 md:mb-8 border-b pb-4">
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-orange-600 flex items-center gap-2 font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-colors">
                <i className="fa-solid fa-arrow-left-long"></i> Back
              </button>
              <h2 className="text-lg md:text-xl font-black text-slate-900">Add New Collection</h2>
              <div className="w-10"></div>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Product Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={mainImageInputRef}
                    onChange={(e) => handleFileChange(e, 'image')}
                  />
                  <button 
                    type="button"
                    onClick={() => mainImageInputRef.current?.click()}
                    className={`w-full py-8 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center gap-2 ${newProduct.image ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-slate-50/50 text-slate-400 hover:border-orange-400'}`}
                  >
                    <i className={`fa-solid ${newProduct.image ? 'fa-check-circle text-orange-500' : 'fa-camera text-2xl opacity-50'}`}></i>
                    <span className="font-black text-[10px] uppercase tracking-widest">
                      {newProduct.image ? 'Image Locked' : 'Select Hero Image'}
                    </span>
                  </button>
                  {newProduct.image && (
                    <div className="mt-2 flex justify-center border rounded-xl p-2 bg-white h-24 overflow-hidden shadow-sm">
                      <img src={newProduct.image} className="h-full object-contain" alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Alternative Mockup</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={mockupImageInputRef}
                    onChange={(e) => handleFileChange(e, 'mockupImage')}
                  />
                  <button 
                    type="button"
                    onClick={() => mockupImageInputRef.current?.click()}
                    className={`w-full py-8 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center gap-2 ${newProduct.mockupImage ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-slate-50/50 text-slate-400 hover:border-blue-400'}`}
                  >
                    <i className={`fa-solid ${newProduct.mockupImage ? 'fa-check-circle text-blue-500' : 'fa-file-image text-2xl opacity-50'}`}></i>
                    <span className="font-black text-[10px] uppercase tracking-widest">
                      {newProduct.mockupImage ? 'Mockup Ready' : 'Add Detail View'}
                    </span>
                  </button>
                  {newProduct.mockupImage && (
                    <div className="mt-2 flex justify-center border rounded-xl p-2 bg-white h-24 overflow-hidden shadow-sm">
                      <img src={newProduct.mockupImage} className="h-full object-contain" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Title</label>
                  <input required className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl outline-none font-bold text-[12px] focus:ring-2 focus:ring-orange-500/20" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Ultra Slim Smart Watch" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">MSRP Price (৳)</label>
                  <input required type="number" className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl outline-none font-bold text-[12px] focus:ring-2 focus:ring-orange-500/20" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Sale Price (৳) - Optional</label>
                  <input type="number" className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl outline-none font-bold text-[12px] focus:ring-2 focus:ring-orange-500/20" value={newProduct.discountPrice || ''} onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined})} placeholder="e.g. 450" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Store Category</label>
                  <select className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl outline-none font-bold text-[12px] focus:ring-2 focus:ring-orange-500/20" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 ml-1">
                  <input 
                    type="checkbox" 
                    id="isFeatured"
                    className="w-5 h-5 accent-orange-600 rounded-md"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                  />
                  <label htmlFor="isFeatured" className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer">Promote as Featured</label>
                </div>
              </div>
              
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Key Features (Comma separated)</label>
                <input 
                  className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl outline-none font-bold text-[12px] focus:ring-2 focus:ring-orange-500/20" 
                  value={featuresText} 
                  onChange={e => setFeaturesText(e.target.value)} 
                  placeholder="e.g. Waterproof, 2-Year Warranty, Premium Leather" 
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Narrative Description</label>
                <textarea required rows={3} className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl outline-none font-bold text-[12px] focus:ring-2 focus:ring-orange-500/20" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Tell the product's story..."></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="button" variant="outline" fullWidth className="h-14 rounded-2xl text-[10px] uppercase tracking-widest order-2 sm:order-1" onClick={() => setIsAdding(false)}>
                  Dismiss
                </Button>
                <Button fullWidth type="submit" className="h-14 rounded-2xl text-[10px] uppercase tracking-widest order-1 sm:order-2">
                  Publish to Ak Shop
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
