'use client';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Header() {
  const { totalCartCount } = useCart();

  return (
    <header className="bg-teal-700 border-b border-teal-800 sticky top-0 z-40 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        {/* মূল হেডার বার (লোগো, সার্চ ও কার্ট) */}
        <div className="flex items-center justify-between gap-3">
          
          {/* লোগো */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/logo.png" alt="Gadget Mart BD Logo" className="object-contain h-8 w-auto bg-white rounded p-1" />
          </Link>

          {/* ডেস্কটপ সার্চ বার */}
          <div className="flex-1 max-w-md hidden md:block relative">
            <input 
              type="text" 
              placeholder="Search for gadgets..." 
              className="w-full bg-white text-gray-800 border border-teal-600 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <span className="absolute right-3 top-2 text-gray-400">🔍</span>
          </div>

          {/* ডানদিকের অপশন: কার্ট আইকন ও মোবাইল মেন্যু বাটন */}
          <div className="flex items-center space-x-3">
            <Link href="/cart" className="relative text-white hover:text-teal-200 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* লাইভ কার্ট কাউন্টার */}
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full border border-teal-700">
                {totalCartCount}
              </span>
            </Link>
            
            <button className="md:hidden text-white text-2xl hover:text-teal-200 transition">☰</button>
          </div>

        </div>

        {/* মোবাইল ভিউর জন্য সার্চ বার (লোগো এবং আইকনের নিচে আলাদা লাইনে দেখাবে) */}
        <div className="mt-3 md:hidden relative">
          <input 
            type="text" 
            placeholder="Search for gadgets..." 
            className="w-full bg-white text-gray-800 border border-teal-600 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-inner"
          />
          <span className="absolute right-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>

      </div>
    </header>
  );
}