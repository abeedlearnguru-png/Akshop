
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col md:flex-row animate-in zoom-in-95 duration-300 text-[13px]">
        
        {/* Navigation Back Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-5 py-2.5 bg-white shadow-2xl border border-gray-100 hover:bg-slate-900 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all group"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform text-orange-600 group-hover:text-white"></i>
          Back to Shop
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100 relative pt-20 md:pt-8">
          <img 
            src={showMockup && product.mockupImage ? product.mockupImage : product.image} 
            alt={product.name} 
            className={`max-w-full max-h-[350px] object-${product.imageFit || 'contain'} transition-all duration-500 drop-shadow-2xl`} 
          />
          
          {product.mockupImage && (
            <div className="absolute bottom-6 flex gap-2">
              <button 
                onClick={() => setShowMockup(false)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${!showMockup ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-400'}`}
                title="Main Image"
              >
                <i className="fa-solid fa-image"></i>
              </button>
              <button 
                onClick={() => setShowMockup(true)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${showMockup ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-400'}`}
                title="Mockup Image"
              >
                <i className="fa-solid fa-eye"></i>
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-white">
          <div className="p-8 pb-4 pt-20 md:pt-8">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">{product.category}</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1 leading-tight tracking-tight">{product.name}</h2>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-orange-500 font-black bg-orange-50 px-3 py-1.5 rounded-lg">
                <i className="fa-solid fa-star text-[10px]"></i>
                <span className="text-slate-900 text-[11px] font-black">{product.rating}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.reviewsCount} Trusted Reviews</span>
            </div>

            <div className="mt-8 flex items-baseline gap-4">
               {hasDiscount ? (
                 <>
                   <span className="text-4xl font-black text-slate-900 tracking-tighter">৳{product.discountPrice?.toLocaleString()}</span>
                   <span className="text-xl text-slate-400 line-through font-bold">৳{product.price.toLocaleString()}</span>
                   <span className="bg-orange-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Limited Offer</span>
                 </>
               ) : (
                 <span className="text-4xl font-black text-slate-900 tracking-tighter">৳{product.price.toLocaleString()}</span>
               )}
            </div>

            {/* Product Options */}
            {product.options && product.options.length > 0 && (
              <div className="mt-8 space-y-6">
                {product.options.map((opt) => (
                  <div key={opt.name}>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Select {opt.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => (
                        <button
                          key={val}
                          onClick={() => handleOptionChange(opt.name, val)}
                          className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all ${
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
            
            <div className="mt-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 border-l-2 border-orange-600 pl-3">Specifications</h4>
              <p className="text-slate-600 leading-relaxed font-medium text-[13px]">{product.description}</p>
              
              {product.features && product.features.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.features.map(f => (
                    <span key={f} className="bg-slate-50 text-slate-500 text-[9px] px-3 py-1 rounded-lg font-bold border border-slate-100 italic">
                      # {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 space-y-3">
               <a 
                 href={whatsappUrl} 
                 target="_blank" 
                 className="flex items-center justify-center gap-4 h-16 bg-green-500 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-600 hover:-translate-y-1 transition-all text-sm"
               >
                 <i className="fa-brands fa-whatsapp text-2xl"></i>
                 Order Securely on WhatsApp
               </a>

               <div className="grid grid-cols-2 gap-3">
                  <Button fullWidth size="md" variant="outline" className="h-14 rounded-xl text-[10px] uppercase tracking-widest border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white" onClick={() => onAddToCart(product, selectedOptions)}>
                    <i className="fa-solid fa-cart-plus mr-2"></i> Add to Cart
                  </Button>
                  <a href={`https://t.me/${settings.telegram}`} target="_blank" className="flex items-center justify-center gap-2 bg-blue-50 text-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                    <i className="fa-brands fa-telegram text-lg"></i> Support Chat
                  </a>
               </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="p-8 border-t border-gray-100 bg-gray-50/30 mt-4">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-comments text-orange-600"></i> Client Testimonials
            </h3>
            {user ? (
              <form onSubmit={handleSubmitReview} className="mb-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Your Rating</p>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl transition-all hover:scale-125 ${rating >= star ? 'text-orange-400' : 'text-gray-200'}`}>
                      <i className="fa-solid fa-star"></i>
                    </button>
                  ))}
                </div>
                <textarea required rows={2} className="w-full px-5 py-3 border rounded-2xl outline-none text-[12px] bg-gray-50 focus:ring-2 focus:ring-orange-500/20 font-medium" placeholder="Describe your experience..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <Button type="submit" size="sm" className="mt-4 px-8 h-10 text-[9px] uppercase tracking-widest">Post Review</Button>
              </form>
            ) : (
              <div className="mb-8 p-6 bg-orange-50/50 rounded-2xl border border-dashed border-orange-200 text-center">
                <p className="text-[11px] font-bold text-orange-700">Join Ak Shop to leave a review.</p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((rev) => (
                <div key={rev.id} className="bg-white border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black border border-slate-700 shadow-sm">{rev.userName.charAt(0)}</div>
                      <div>
                        <p className="text-[12px] font-black text-slate-900 leading-none">{rev.userName}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 text-orange-400 text-[9px]">
                      {[...Array(5)].map((_, i) => <i key={i} className={`fa-solid fa-star ${i >= rev.rating ? 'text-gray-100' : ''}`}></i>)}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-600 italic font-medium leading-relaxed">"{rev.comment}"</p>
                </div>
              )) : (
                <div className="text-center py-10">
                   <i className="fa-solid fa-pen-nib text-slate-100 text-4xl mb-4"></i>
                   <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Be the first to share feedback</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
