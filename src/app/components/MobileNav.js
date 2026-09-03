'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const phoneNumber = "01516554116";
  const whatsappUrl = `https://wa.me/88${phoneNumber}`;
  const callUrl = `tel:${phoneNumber}`;

  // যদি পেজটি সিঙ্গেল প্রোডাক্ট পেজ হয় (অর্থাৎ পাথ `/product/` দিয়ে শুরু হয়), তবে মোবাইল নেভিগেশন বার হাইড থাকবে
  if (pathname && pathname.startsWith('/product/')) {
    return null;
  }

  return (
    <>
      {/* মোবাইল বটম নেভিগেশন বার (md:hidden দিয়ে শুধু মোবাইলে দেখানো নিশ্চিত করা হয়েছে) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] z-50 flex justify-around items-center py-2 px-1 text-xs text-gray-700">
        
        {/* Search Button */}
        <button 
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6 mb-0.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[11px] font-medium">Search</span>
        </button>

        {/* Cart Button */}
        <Link 
          href="/checkout" 
          className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6 mb-0.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-[11px] font-medium">Cart</span>
        </Link>

        {/* Home Button */}
        <Link 
          href="/" 
          className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6 mb-0.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[11px] font-medium">Home</span>
        </Link>

        {/* WhatsApp Button */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6 mb-0.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[11px] font-medium">WhatsApp</span>
        </a>

        {/* Call Button */}
        <a 
          href={callUrl}
          className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6 mb-0.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-[11px] font-medium">Call</span>
        </a>

      </div>

      {/* ফুল-স্ক্রিন সার্চ ওভারলে */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-[999] flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mr-3">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                autoFocus
                placeholder="Search gadgets & more" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <button 
              onClick={() => setSearchOpen(false)}
              className="text-gray-600 p-2 text-xl font-bold focus:outline-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-3">Please enter 3 or more characters</p>
            <p className="text-sm font-bold text-gray-800 mb-3">Hot searches</p>
            <div className="flex flex-wrap gap-2">
              {['HUMIDIFIER', 'EARBUDS', 'POWER BANK', 'SMARTWATCH', 'SPEAKER', 'MOBILE CASE'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-gray-100 hover:bg-teal-50 hover:text-teal-600 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}