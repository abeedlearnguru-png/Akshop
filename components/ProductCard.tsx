
import React from 'react';
import { Product, ShopSettings } from '../types';

interface ProductCardProps {
  product: Product;
  settings: ShopSettings;
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, settings, onAddToCart, onProductClick }) => {
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=I'm interested in ${product.name} (Price: ৳${product.discountPrice || product.price})`;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div 
      className="group bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(255,165,0,0.15)] transition-all duration-500 flex flex-col h-full cursor-pointer relative"
      onClick={() => onProductClick(product)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 p-4 md:p-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-${product.imageFit || 'contain'} group-hover:scale-110 transition-transform duration-700 ease-out`}
        />
        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/95 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-xl text-[8px] md:text-[10px] font-black text-slate-900 shadow-xl flex items-center gap-1 border border-white">
          <i className="fa-solid fa-star text-orange-400"></i>
          {product.rating}
        </div>
        {(product.isFeatured || hasDiscount) && (
          <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 flex flex-col gap-1 md:gap-2">
             {product.isFeatured && (
               <span className="bg-gradient-to-tr from-orange-600 to-red-600 text-white text-[7px] md:text-[8px] px-2 py-0.5 md:px-3 md:py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-orange-900/20">Featured</span>
             )}
             {hasDiscount && (
               <span className="bg-slate-900 text-white text-[7px] md:text-[8px] px-2 py-0.5 md:px-3 md:py-1 rounded-full font-black uppercase tracking-widest shadow-lg">Sale</span>
             )}
          </div>
        )}
      </div>
      <div className="p-4 md:p-8 flex-1 flex flex-col">
        <span className="text-[8px] md:text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1.5 md:mb-3">{product.category}</span>
        <h3 className="font-black text-slate-900 text-sm md:text-xl mt-0.5 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight min-h-[2.5rem] md:min-h-0">
          {product.name}
        </h3>
        
        <div className="mt-4 md:mt-8 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
             <div className="flex flex-col">
                {hasDiscount ? (
                  <>
                    <span className="text-sm md:text-2xl font-black text-slate-900 truncate">৳{product.discountPrice?.toLocaleString()}</span>
                    <span className="text-[9px] md:text-[11px] text-slate-400 line-through font-bold">৳{product.price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="text-sm md:text-2xl font-black text-slate-900 truncate">৳{product.price.toLocaleString()}</span>
                )}
             </div>
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <a 
              href={whatsappUrl}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 md:w-12 md:h-12 bg-green-500 text-white rounded-[10px] md:rounded-[16px] flex items-center justify-center hover:bg-green-600 transition-all shadow-lg active:scale-90"
              title="Order on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-sm md:text-lg"></i>
            </a>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }} 
              className="w-8 h-8 md:w-12 md:h-12 bg-slate-900 text-white rounded-[10px] md:rounded-[16px] flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl active:scale-90"
              title="Add to Cart"
            >
              <i className="fa-solid fa-cart-plus text-sm md:text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
