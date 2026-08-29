"use client";
import Link from "next/link";
import SliderComponent from "./SliderComponent";
import { useState, useEffect } from "react";

export const revalidate = 3600; 

const ck = "ck_e8bee42940cb29849845a1b7b1f2b057caac6db0";
const cs = "cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc";
const domain = "https://gadgetmartbd.shop";

async function fetchWooCommerceData(endpoint) {
  try {
    const res = await fetch(`${domain}/wp-json/wc/v3/${endpoint}&consumer_key=${ck}&consumer_secret=${cs}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = JSON.parse(localStorage.getItem("gadget_cart")) || [];
      setCartCount(savedCart.reduce((total, item) => total + item.quantity, 0));
    }

    async function loadData() {
      const catData = await fetchWooCommerceData("products/categories?hide_empty=true");
      const bestData = await fetchWooCommerceData("products?popularity=1&per_page=6");
      const allData = await fetchWooCommerceData("products?per_page=12");
      
      setCategories(catData);
      setBestSellers(bestData);
      setAllProducts(allData);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* হেডার */}
      <header className="bg-[#e6f7eb] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <button className="block md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <nav className="hidden md:flex space-x-6 text-gray-700 font-semibold">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <Link href="#all-products" className="hover:text-teal-600">Shop</Link>
            <Link href="#categories" className="hover:text-teal-600">Categories</Link>
          </nav>
          
          <div className="flex items-center justify-center flex-grow md:flex-grow-0">
            <Link href="/">
              <img src="/logo.png" alt="Gadget Mart BD" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <input type="text" placeholder="Search gadgets..." className="hidden md:block bg-white border border-gray-300 text-xs rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:border-teal-500 w-40 md:w-56" />
              <button className="text-gray-700 hover:text-teal-600 md:absolute md:right-2">
                <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
            <div className="relative">
              <Link href="/checkout" className="text-gray-700 relative flex items-center justify-center border border-gray-400 p-1 rounded-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        
        {/* ১. স্লাইডার */}
        <section className="mb-4 rounded-xl overflow-hidden shadow">
          <SliderComponent />
        </section>

        {/* প্রমোশনাল ব্যানার */}
        <section className="grid grid-cols-3 gap-2 mb-8">
            <img src="/banner1.jpg" alt="Promo 1" className="w-full h-auto rounded-lg shadow-sm border border-gray-200" />
            <img src="/banner2.jpg" alt="Promo 2" className="w-full h-auto rounded-lg shadow-sm border border-gray-200" />
            <img src="/banner3.jpg" alt="Promo 3" className="w-full h-auto rounded-lg shadow-sm border border-gray-200" />
        </section>

        {/* ২. Product Category */}
        <section id="categories" className="mb-10">
          <SectionTitle title="Product Category" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="flex flex-col items-center justify-center cursor-pointer group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border border-teal-500 shadow-sm flex items-center justify-center group-hover:shadow-md transition-all p-2">
                   {cat.image ? (
                     <img src={cat.image.src} alt={cat.name} className="w-full h-full object-contain" loading="lazy" />
                   ) : (
                     <span className="text-xs text-center text-gray-400">No Image</span>
                   )}
                </div>
                <span className="text-sm font-medium text-gray-700 mt-2 text-center underline decoration-teal-500 underline-offset-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ৩. Best Selling Product */}
        <section className="mb-10">
          <SectionTitle title="Best Selling Product" />
          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x mt-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="min-w-[180px] md:min-w-[220px] snap-start flex-shrink-0">
                 <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* ৪. All products */}
        <section id="all-products" className="mb-12">
          <SectionTitle title="All products" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mt-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </main>

      {/* ফুটার */}
      <footer className="bg-[#bfdbfe] text-center pt-8 pb-12 px-4 text-[#334155] text-sm md:text-base leading-relaxed relative">
        <p className="font-bold text-lg mb-1">Gadget Mart BD</p>
        <p>Your trusted destination for quality gadgets and smart<br/>accessories across Bangladesh.</p>
        <p className="mt-3">Website Developed By</p>
        <p className="font-bold text-blue-700">SHAHED</p>
        <p className="mt-3 font-semibold">Contact Information</p>
        <p>Phone: +8801516554116</p>
        
        <button className="absolute bottom-6 right-6 bg-fuchsia-500 text-white p-3 rounded-lg shadow-lg">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
           </svg>
        </button>
      </footer>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex justify-center">
      <h2 className="bg-[#16a085] text-white text-lg md:text-xl font-bold py-2 px-10 rounded-md shadow-sm">
        {title}
      </h2>
    </div>
  );
}

// প্রোডাক্ট কার্ড (সরাসরি ?id=product_id দিয়ে চেকআউটে যাওয়ার লিংকযুক্ত)
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#16a085] flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`} className="relative h-40 md:h-48 w-full p-2 flex items-center justify-center bg-white cursor-pointer block">
        {product.images && product.images[0] ? (
          <img src={product.images[0].src} alt={product.name} className="object-contain h-full w-full" loading="lazy" />
        ) : (
          <span className="text-gray-300">No Image</span>
        )}
      </Link>
      <div className="p-3 flex flex-col flex-grow text-center">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-gray-700 text-sm mb-2 line-clamp-2 min-h-[40px] hover:text-teal-600 cursor-pointer">{product.name}</h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex flex-col items-center justify-center mb-3">
             {product.sale_price ? (
               <>
                 <span className="line-through text-[#16a085] text-xs font-semibold" dangerouslySetInnerHTML={{ __html: product.regular_price + '৳' }}></span>
                 <span className="text-[#16a085] font-bold text-base" dangerouslySetInnerHTML={{ __html: product.sale_price + '৳' }}></span>
               </>
             ) : (
               <span className="text-[#16a085] font-bold text-base" dangerouslySetInnerHTML={{ __html: product.price + '৳' }}></span>
             )}
          </div>
          
          <Link href={`/checkout?id=${product.id}`} className="block w-full">
            <button className="w-full bg-[#ff0000] text-white text-sm font-bold py-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer">
              অর্ডার করুন
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}