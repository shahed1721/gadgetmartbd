import Image from 'next/image';
import Link from 'next/link';
// নতুন তৈরি করা ProductBottomBar ইমপোর্ট করা হলো
import ProductBottomBar from '../../components/ProductBottomBar'; 

// ১ ঘণ্টা (৩৬০০ সেকেন্ড) ক্যাশ ফিক্সড থাকবে
export const revalidate = 3600;
export const dynamicParams = true;

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';
const DOMAIN = 'https://gadgetmartbd.shop';

// স্ট্যাটিক জেনারেশনের জন্য পসিবল আইডিগুলো প্রি-ফেচ করা
export async function generateStaticParams() {
  try {
    const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products?per_page=50&consumer_key=${CK}&consumer_secret=${CS}`);
    if (!res.ok) return [];
    const products = await res.json();
    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    return [];
  }
}

async function getProduct(id) {
  try {
    const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products/${id}?consumer_key=${CK}&consumer_secret=${CS}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
          <span className="text-5xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">প্রোডাক্টটি পাওয়া যায়নি!</h2>
          <p className="text-slate-500 mb-6 text-sm">দয়া করে সঠিক প্রোডাক্টটি সিলেক্ট করুন অথবা স্টোরে ফিরে যান।</p>
          <Link href="/" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full block shadow-md">
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.src || '/logo.png';
  const regularPrice = product.regular_price ? `৳ ${product.regular_price}` : '';
  const salePrice = product.price ? `৳ ${product.price}` : '';

  return (
    <main className="min-h-screen bg-slate-50/50 pb-28 pt-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* প্রোডাক্ট ইমেজ সেকশন */}
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

        {/* প্রোডাক্ট ডিটেইলস সেকশন */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-6">
          
          {/* ক্যাটাগরি */}
          <div className="flex flex-wrap gap-2">
            {product.categories?.map(c => (
              <span key={c.id} className="bg-teal-50 text-teal-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {c.name}
              </span>
            )) || <span className="bg-teal-50 text-teal-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">General</span>}
          </div>

          {/* প্রোডাক্টের নাম */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight" dangerouslySetInnerHTML={{ __html: product.name }} />

          {/* দাম */}
          <div className="flex items-center gap-4 bg-slate-50 inline-flex px-5 py-3 rounded-2xl border border-slate-100">
            <span className="text-3xl sm:text-4xl font-black text-teal-600">{salePrice}</span>
            {regularPrice && regularPrice !== salePrice && (
              <span className="text-slate-400 line-through text-lg font-medium">{regularPrice}</span>
            )}
          </div>

          {/* কোয়ান্টিটি (স্ট্যাটিক ডিজাইন) */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-sm font-semibold text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <button className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors font-bold">-</button>
              <span className="px-4 py-2 font-bold text-slate-800 border-l border-r border-slate-200 bg-white">1</span>
              <button className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors font-bold">+</button>
            </div>
          </div>

        </div>

        {/* বিবরণী / ডেসক্রিপশন সেকশন */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
          {/* ডেসক্রিপশন ট্যাব */}
          <div className="flex gap-8 border-b border-slate-200">
            <button className="text-teal-600 border-b-2 border-teal-600 pb-3 font-bold text-sm sm:text-base tracking-wide">
              Description
            </button>
            <button className="text-slate-400 pb-3 font-semibold text-sm sm:text-base hover:text-slate-600 transition-colors">
              Reviews (0)
            </button>
          </div>

          {/* মূল বিবরণী */}
          <div 
            className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed prose prose-teal max-w-none prose-p:mb-4 prose-headings:text-slate-800 prose-a:text-teal-600 hover:prose-a:text-teal-700"
            dangerouslySetInnerHTML={{ __html: product.description || product.short_description || '<p>এই প্রোডাক্টটির কোনো বিস্তারিত বিবরণ দেওয়া নেই।</p>' }}
          />
        </div>

      </div>

      {/* নতুন স্মার্ট ProductBottomBar কম্পোনেন্টটি এখানে কল করা হলো */}
      <ProductBottomBar product={product} />
      
    </main>
  );
}