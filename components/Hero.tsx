
import React from 'react';
import Button from './Button';

const Hero = () => {
  const scrollToShop = () => {
    const shop = document.getElementById('shop-section');
    if (shop) {
      const offset = 140;
      const elementPosition = shop.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[35vh] md:min-h-[45vh] flex items-center overflow-hidden">
      {/* Background with advanced overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          className="h-full w-full object-cover object-center transform scale-105 animate-pulse-slow" 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" 
          alt="Premium Boutique" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full py-12">
        <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-orange-600 rounded-full"></span>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">The Vault Collection</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
            Elevate Your <br />
            <span className="text-orange-500">Everyday Standards.</span>
          </h1>
          
          <p className="mt-6 text-slate-300 text-sm md:text-lg font-medium max-w-lg leading-relaxed">
            Discover a meticulously curated selection of premium electronics, 
            artisan accessories, and lifestyle essentials designed for those who 
            refuse to compromise on quality.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="px-8 h-14 rounded-2xl shadow-2xl shadow-orange-900/20 text-[10px] uppercase tracking-widest" 
              onClick={scrollToShop}
            >
              Explore Products
            </Button>
            <div className="flex items-center gap-4 pl-4 border-l border-white/10 hidden sm:flex">
               <div className="text-white">
                  <p className="text-lg font-black leading-none">5.0</p>
                  <div className="flex text-orange-400 text-[8px] mt-1">
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star"></i>
                  </div>
               </div>
               <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-tight">Trusted by <br/>10k+ Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Accents */}
      <div className="absolute bottom-10 right-10 hidden lg:block animate-bounce-slow">
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-xl">
                  <i className="fa-solid fa-shield-check"></i>
               </div>
               <div>
                  <p className="text-white font-black text-sm">Official Warranty</p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Guaranteed Original</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Hero;
