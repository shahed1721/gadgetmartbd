'use client';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Header() {
  const { totalCartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      
      {/* টপ নোটিফিকেশন বার */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-center py-1.5 text-xs font-medium tracking-wide">
        CarryBee কুরিয়ারের মাধ্যমে সারা বাংলাদেশে দ্রুত ডেলিভারি! ⚡
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* লোগো */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <img src="/logo.png" alt="Gadget Mart BD" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-emerald-600 hidden sm:block">
              Gadget Mart
            </span>
          </Link>

          {/* মডার্ন সার্চ বার */}
          <div className="flex-1 max-w-xl hidden md:flex items-center relative">
            <input 
              type="text" 
              placeholder="আপনার পছন্দের গ্যাজেট খুঁজুন..." 
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-full pl-5 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all shadow-inner"
            />
            <button className="absolute right-1.5 top-1.5 p-1.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </div>

          {/* নেভিগেশন ও আইকনস */}
          <div className="flex items-center gap-5">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-600">
              <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-teal-600 transition-colors">Shop</Link>
              <Link href="/track" className="hover:text-teal-600 transition-colors">Track Order</Link>
            </nav>
            
            {/* কার্ট আইকন (বাটনের বদলে Link করা হয়েছে) */}
            <div className="flex items-center gap-3">
              <Link href="/cart" className="relative p-2.5 text-gray-700 hover:text-teal-600 transition-colors bg-gray-100/50 hover:bg-teal-50 rounded-full border border-transparent hover:border-teal-100 inline-flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm">
                  {totalCartCount}
                </span>
              </Link>
              
              {/* মোবাইল মেন্যু হ্যামবার্গার */}
              <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}