
import React, { useState } from 'react';
import { Product, User, Review, ShopSettings } from '../types';
import Button from './Button';

interface ProductDetailModalProps {
  product: Product;
  user: User | null;
  settings: ShopSettings;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product, selectedOptions?: Record<string, string>) => void;
  onSubmitReview: (productId: string, rating: number, comment: string) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  user,
  settings,
  isOpen,
  onClose,
  onAddToCart,
  onSubmitReview
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showMockup, setShowMockup] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onSubmitReview(product.id, rating, comment);
    setComment('');
    setRating(5);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const reviews = product.reviews || [];
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const finalPrice = hasDiscount ? product.discountPrice! : product.price;
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=Hello Ak Shop! I want to purchase: ${product.name} (Price: ৳${finalPrice})`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="bg-white rounded-t-[32px] sm:rounded-[40px] shadow-2xl w-full max-w-5xl h-full sm:h-auto max-h-full sm:max-h-[95vh] overflow-hidden relative flex flex-col md:flex-row animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 text-[13px]">
        
        {/* Navigation Back Button - Sticky/Fixed for mobile scroll */}
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur shadow-xl border border-gray-100 hover:bg-slate-900 hover:text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all group"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform text-orange-600 group-hover:text-white"></i>
          <span>Close</span>
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col items-center justify-center p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 relative pt-16 md:pt-8 min-h-[250px] md:min-h-0 flex-shrink-0">
          <img 
            src={showMockup && product.mockupImage ? product.mockupImage : product.image} 
            alt={product.name} 
            className={`max-w-full max-h-[220px] md:max-h-[400px] object-${product.imageFit || 'contain'} transition-all duration-500 drop-shadow-2xl`} 
          />
          
          {product.mockupImage && (
            <div className="absolute bottom-4 flex gap-2">
              <button 
                onClick={() => setShowMockup(false)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${!showMockup ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-400'}`}
                title="Main Image"
              >
                <i className="fa-solid fa-image text-xs"></i>
              </button>
              <button 
                onClick={() => setShowMockup(true)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${showMockup ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-400'}`}
                title="Mockup Image"
              >
                <i className="fa-solid fa-eye text-xs"></i>
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-white custom-scrollbar">
          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] md:text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] md:tracking-[0.3em]">{product.category}</span>
              <div className="flex items-center gap-1.5 text-orange-500 font-black bg-orange-50 px-2.5 py-1.5 rounded-lg md:hidden">
                <i className="fa-solid fa-star text-[9px]"></i>
                <span className="text-slate-900 text-[10px] font-black">{product.rating}</span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">{product.name}</h2>
            
            <div className="hidden md:flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 text-orange-500 font-black bg-orange-50 px-2.5 py-1.5 rounded-lg">
                <i className="fa-solid fa-star text-[9px]"></i>
                <span className="text-slate-900 text-[11px] font-black">{product.rating}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.reviewsCount} Trusted Reviews</span>
            </div>

            <div className="flex items-baseline gap-3 md:gap-4 mb-8">
               {hasDiscount ? (
                 <>
                   <span className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">৳{product.discountPrice?.toLocaleString()}</span>
                   <span className="text-lg md:text-2xl text-slate-400 line-through font-bold">৳{product.price.toLocaleString()}</span>
                   <span className="bg-orange-600 text-white text-[8px] md:text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">Sale</span>
                 </>
               ) : (
                 <span className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">৳{product.price.toLocaleString()}</span>
               )}
            </div>

            {/* Product Options - Scrollable on mobile if many */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-6 mb-8">
                {product.options.map((opt) => (
                  <div key={opt.name}>
                    <h4 className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Select {opt.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => (
                        <button
                          key={val}
                          onClick={() => handleOptionChange(opt.name, val)}
                          className={`px-4 py-2.5 rounded-xl text-[10px] md:text-[12px] font-black border transition-all ${
                            selectedOptions[opt.name] === val 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                            : 'bg-white border-gray-100 text-slate-600 hover:border-orange-200'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mb-8">
              <h4 className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-l-2 border-orange-600 pl-3">Specifications</h4>
              <p className="text-slate-600 leading-relaxed font-medium text-[13px] md:text-[15px] mb-6">
                {product.description}
              </p>
              
              {product.features && product.features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map(f => (
                    <div key={f} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[10px]">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur pt-4 pb-2 sm:static sm:bg-transparent sm:p-0 space-y-3">
               <a 
                 href={whatsappUrl} 
                 target="_blank" 
                 className="flex items-center justify-center gap-3 h-14 md:h-16 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-600 hover:-translate-y-1 transition-all text-[11px] md:text-sm"
               >
                 <i className="fa-brands fa-whatsapp text-xl md:text-2xl"></i>
                 Order on WhatsApp
               </a>

               <div className="grid grid-cols-2 gap-3">
                  <Button fullWidth size="lg" variant="outline" className="h-14 md:h-16 rounded-2xl text-[9px] md:text-[11px] uppercase tracking-widest border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white" onClick={() => onAddToCart(product, selectedOptions)}>
                    <i className="fa-solid fa-cart-plus mr-1 md:mr-2"></i> Add Cart
                  </Button>
                  <a href={`https://t.me/${settings.telegram}`} target="_blank" className="flex items-center justify-center gap-1.5 md:gap-2 bg-blue-50 text-blue-500 rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                    <i className="fa-brands fa-telegram text-base md:text-lg"></i> Telegram
                  </a>
               </div>
            </div>

            {/* Review Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <i className="fa-solid fa-comments text-orange-600"></i> Client Reviews
              </h3>
              {user ? (
                <form onSubmit={handleSubmitReview} className="mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Post your feedback</p>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl transition-all hover:scale-125 ${rating >= star ? 'text-orange-400' : 'text-gray-200'}`}>
                        <i className="fa-solid fa-star"></i>
                      </button>
                    ))}
                  </div>
                  <textarea required rows={3} className="w-full px-5 py-4 border border-gray-200 rounded-2xl outline-none text-[12px] md:text-[13px] bg-white focus:ring-4 focus:ring-orange-500/10 font-medium transition-all" placeholder="Tell us what you think..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                  <Button type="submit" size="md" className="mt-5 px-8 h-12 text-[10px] uppercase tracking-widest">Publish Review</Button>
                </form>
              ) : (
                <div className="mb-10 p-8 bg-orange-50/50 rounded-3xl border border-dashed border-orange-200 text-center">
                  <p className="text-[12px] font-bold text-orange-700">Login to share your experience with this product.</p>
                </div>
              )}

              <div className="space-y-6">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-black">{rev.userName.charAt(0)}</div>
                        <div>
                          <p className="text-[12px] font-black text-slate-900 leading-none">{rev.userName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 text-orange-400 text-[10px]">
                        {[...Array(5)].map((_, i) => <i key={i} className={`fa-solid fa-star ${i >= rev.rating ? 'text-gray-100' : ''}`}></i>)}
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-600 italic font-medium leading-relaxed">"{rev.comment}"</p>
                  </div>
                )) : (
                  <div className="text-center py-12">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 text-3xl mx-auto mb-4">
                        <i className="fa-solid fa-pen-nib"></i>
                     </div>
                     <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Be the first to review this product</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
