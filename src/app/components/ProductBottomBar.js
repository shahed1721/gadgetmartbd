'use client';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';

export default function ProductBottomBar({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Add to Cart বাটনের কাজ: শুধু কার্টে যোগ করবে এবং মেসেজ দেখাবে
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price || product.regular_price,
      image: product.images?.[0]?.src || '/logo.png',
    });
    alert('পণ্যটি সফলভাবে কার্টে যোগ হয়েছে! 🛒');
  };

  // Order Now বাটনের কাজ: আগে কার্টে অ্যাড করবে, তারপর চেকআউটে যাবে
  const handleOrderNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price || product.regular_price,
      image: product.images?.[0]?.src || '/logo.png',
    });
    // কার্টে অ্যাড হওয়ার পর চেকআউট পেজে রিডাইরেক্ট করবে
    router.push(`/checkout?id=${product.id}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200/60 p-3 sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 transition-all">
      <div className="max-w-3xl mx-auto flex gap-3 sm:gap-4 h-full items-center">
        
        {/* Add to Cart বাটন */}
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md text-sm sm:text-base h-full"
        >
          <svg className="w-5 h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Add to Cart
        </button>

        {/* Order Now বাটন */}
        <button 
          onClick={handleOrderNow}
          className="flex-[1.5] w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-teal-500/30 text-sm sm:text-base h-full"
        >
          ⚡ অর্ডার করুন
        </button>
        
      </div>
    </div>
  );
}