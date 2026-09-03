'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { totalCartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
        const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';
        const res = await fetch(`https://gadgetmartbd.shop/wp-json/wc/v3/products/categories?hide_empty=true&per_page=50&consumer_key=${CK}&consumer_secret=${CS}`);
        const data = await res.json();
        const filtered = data.filter(cat => cat.name !== 'Uncategorized');
        setCategories(filtered);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-teal-700 border-b border-teal-800 z-45 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        {/* মোবাইল ভিউ */}
        <div className="md:hidden">
          <div className="relative flex items-center justify-between gap-3">
            <button className="text-white text-2xl hover:text-teal-200 transition">☰</button>
            <Link href="/" className="flex items-center absolute left-1/2 -translate-x-1/2">
              <img src="/logo.png" alt="Gadget Mart BD Logo" style={{ width: '85px' }} className="object-contain" />
            </Link>
            <Link href="/cart" className="relative text-white hover:text-teal-200 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full border border-teal-700">{totalCartCount}</span>
            </Link>
          </div>
          <form onSubmit={handleSearch} className="mt-3 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gadgets..." 
              className="w-full bg-white text-gray-800 border border-teal-600 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-inner"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 text-sm">🔍</button>
          </form>
        </div>

        {/* ডেস্কটপ ভিউ */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="Gadget Mart BD Logo" style={{ width: '95px' }} className="object-contain" />
            </Link>

            <nav className="flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-teal-200 transition-colors flex items-center gap-1.5">🏠 Home</Link>
              <Link href="/shop" className="hover:text-teal-200 transition-colors flex items-center gap-1.5">🛍️ Shop</Link>
              <Link href="/flash-sale" className="text-yellow-300 hover:text-yellow-100 transition-colors flex items-center gap-1.5 animate-pulse">⚡ Flash Sale</Link>
              <Link href="/track-order" className="hover:text-teal-200 transition-colors flex items-center gap-1.5">🚚 Track Order</Link>
            </nav>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-semibold bg-teal-800/50 px-4 py-1.5 rounded-full border border-teal-600/30">
                <span className="text-teal-200">📞 Support:</span>
                <a href="tel:+8801516554116" className="hover:text-white text-teal-50 transition-colors">01516554116</a>
              </div>
              <Link href="/cart" className="relative text-white hover:text-teal-200 transition">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[12px] font-bold px-2 py-0.5 rounded-full border border-teal-700">{totalCartCount}</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer z-50">
              <button className="flex items-center justify-between w-[240px] bg-teal-800 hover:bg-teal-900 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm border border-teal-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  All Categories
                </div>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-[240px] bg-white text-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-100 max-h-[400px] overflow-y-auto">
                {loadingCats ? (
                  <div className="px-5 py-4 text-sm text-gray-500 flex items-center justify-center gap-2">
                    <span className="animate-pulse">Loading categories...</span>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.id}`} className="block px-5 py-3 hover:bg-teal-50 hover:text-teal-700 hover:pl-7 transition-all border-b border-gray-50 flex items-center justify-between text-sm font-medium">
                      <span>{cat.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{cat.count}</span>
                    </Link>
                  ))
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-500">No categories found.</div>
                )}
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex-1 relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for gadgets..." 
                className="w-full bg-white text-gray-800 border border-teal-600 rounded-lg pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 bg-teal-800 hover:bg-teal-900 text-white px-5 rounded-r-lg transition-colors border-l border-teal-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </form>
          </div>
        </div>

      </div>
    </header>
  );
}