'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from './CartContext';

export default function MobileBottomNav() {
  const { totalCartCount } = useCart();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // আপনার কন্টাক্ট নাম্বারগুলো (যেগুলো আপনি আগের হেডারে ব্যবহার করেছেন)
  const whatsappNumber = "8801516554116";
  const callNumber = "+8801516554116";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    // আপনি চাইলে ট্যাগ ক্লিক করার সাথে সাথেই সার্চ পেজে পাঠাতে পারেন
    // router.push(`/search?q=${encodeURIComponent(tag)}`);
    // setIsSearchOpen(false);
  };

  return (
    <>
      {/* বটম নেভিগেশন বার (শুধুমাত্র মোবাইলে দেখাবে) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[9999] flex justify-around items-center py-2 pb-safe">
        
        {/* Search Button */}
        <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center justify-center text-gray-600 w-1/5 gap-1">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span className="text-[10px] font-medium leading-none">Search</span>
        </button>

        {/* Cart Button */}
        <Link href="/cart" className="flex flex-col items-center justify-center text-gray-600 w-1/5 gap-1 relative">
          <div className="relative">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-teal-600 text-white text-[9px] px-[5px] py-[2px] rounded-full font-bold">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium leading-none">Cart</span>
        </Link>

        {/* Home Button */}
        <Link href="/" className="flex flex-col items-center justify-center text-gray-600 w-1/5 gap-1">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium leading-none">Home</span>
        </Link>

        {/* WhatsApp Button */}
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-gray-600 w-1/5 gap-1">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span className="text-[10px] font-medium leading-none">WhatsApp</span>
        </a>

        {/* Call Button */}
        <a href={`tel:${callNumber}`} className="flex flex-col items-center justify-center text-gray-600 w-1/5 gap-1">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span className="text-[10px] font-medium leading-none">Call</span>
        </a>
      </div>

      {/* ফুলস্ক্রিন সার্চ ওভারলে */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[100000] flex flex-col md:hidden">
          <div className="flex items-center p-3 border-b border-gray-200">
            <form onSubmit={handleSearch} className="flex flex-1 bg-gray-100 rounded-full px-4 py-2 items-center mr-3">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gadgets & more" 
                autoFocus
                className="bg-transparent border-none outline-none w-full text-sm text-gray-800"
              />
              <button type="submit" className="text-gray-500 ml-2">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </form>
            <button onClick={() => setIsSearchOpen(false)} className="text-gray-600 p-1">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="p-5">
            <p className="text-gray-500 text-xs mb-4">Please enter 3 or more characters</p>
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold text-sm mb-3">Hot searches</span>
              <div className="flex flex-wrap gap-2">
                {/* আপনার পিএইচপি কোডের ট্যাগগুলো[cite: 1] */}
                {['HUMIDIFIER', 'EARBUDS', 'POWER BANK', 'SMARTWATCH', 'SPEAKER', 'MOBILE CASE'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="bg-gray-100 border-none px-3 py-1.5 rounded-full text-xs text-gray-700 active:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}