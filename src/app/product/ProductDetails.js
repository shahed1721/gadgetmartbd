'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProductBottomBar from '../../components/ProductBottomBar'; // পাথ ঠিক আছে কি না চেক করে নেবেন

export default function ProductDetails({ product }) {
  const router = useRouter();

  // আপনার ViewContent অ্যাড ট্র্যাকিং সেটআপ (পেজ লোড হওয়ার সাথে সাথেই ফায়ার হবে)
  useEffect(() => {
    if (product) {
      const viewContentData = {
        value: Number(product.price || product.regular_price || 0),
        currency: 'BDT',
        content_ids: [String(product.id)],
        content_name: product.name,
        content_type: 'product'
      };

      // Facebook Pixel (Browser)
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', viewContentData);
      }

      // Conversion API (Server)
      fetch('/api/track-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'ViewContent',
          eventData: { custom_data: viewContentData }
        })
      }).catch(err => console.log('CAPI ViewContent Error:', err));
    }
  }, [product]);

  const handleOrderNow = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price || product.regular_price || 0),
      image: product.images?.[0]?.src || '/logo.png',
      quantity: 1,
      slug: product.slug
    };
    localStorage.setItem('cart', JSON.stringify([cartItem]));
    router.push('/checkout');
  };

  const imageUrl = product.images?.[0]?.src || '/logo.png';
  const regularPrice = product.regular_price ? `৳ ${product.regular_price}` : '';
  const salePrice = product.price ? `৳ ${product.price}` : '';

  return (
    <main className="min-h-screen bg-slate-50/50 pb-28 pt-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* প্রোডাক্ট ইমেজ */}
        <div className="relative w-full h-[380px] sm:h-[500px] bg-white rounded-3xl p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 group">
          {product.on_sale && (
            <span className="absolute top-6 left-6 bg-red-500 text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-full font-extrabold z-10 shadow-md animate-pulse tracking-wide">
              🔥 SALE!
            </span>
          )}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-50/50">
            <Image 
              src={imageUrl} 
              alt={product.name} 
              fill 
              priority
              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out p-4" 
            />
          </div>
        </div>

        {/* প্রোডাক্ট ইনফো */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-6">
          <div className="flex flex-wrap gap-2">
            {product.categories?.map(c => (
              <span key={c.id} className="bg-teal-50 text-teal-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {c.name}
              </span>
            )) || <span className="bg-teal-50 text-teal-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">General</span>}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight" dangerouslySetInnerHTML={{ __html: product.name }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-3xl sm:text-4xl font-black text-teal-600">{salePrice}</span>
              {regularPrice && regularPrice !== salePrice && (
                <span className="text-slate-400 line-through text-lg font-medium">{regularPrice}</span>
              )}
            </div>

            <button 
              onClick={handleOrderNow}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-3 rounded-xl transition shadow-md text-center uppercase tracking-wide text-sm sm:text-base cursor-pointer"
            >
              অর্ডার করুন
            </button>
          </div>
        </div>

        {/* ডেসক্রিপশন */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
          <div className="flex gap-8 border-b border-slate-200">
            <button className="text-teal-600 border-b-2 border-teal-600 pb-3 font-bold text-sm sm:text-base tracking-wide">
              Description
            </button>
            <button className="text-slate-400 pb-3 font-semibold text-sm sm:text-base hover:text-slate-600 transition-colors">
              Reviews (0)
            </button>
          </div>

          <div 
            className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed prose prose-teal max-w-none prose-p:mb-4 prose-headings:text-slate-800 prose-a:text-teal-600 hover:prose-a:text-teal-700"
            dangerouslySetInnerHTML={{ __html: product.description || product.short_description || '<p>এই প্রোডাক্টটির কোনো বিস্তারিত বিবরণ দেওয়া নেই।</p>' }}
          />
        </div>
      </div>

      <ProductBottomBar product={product} />
    </main>
  );
}