import Image from 'next/image';
import Link from 'next/link';

// ১ ঘণ্টা (৩৬০০ সেকেন্ড) ক্যাশ ফিক্সড থাকবে, এর মধ্যে কোনো নতুন রিকোয়েস্ট ওয়ার্ডপ্রেসে যাবে না (ন্যানো-সেকেন্ডে লোড হবে)
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
      // স্ট্রং ক্যাশ পলিসি: ১ ঘণ্টা ক্যাশ ব্যবহার করবে, এর আগে ওয়ার্ডপ্রেসে কল করবে না
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
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-red-500 mb-2">প্রোডাক্টটি পাওয়া যায়নি!</h2>
        <p className="text-gray-600 mb-4">দয়া করে সঠিক প্রোডাক্টটি সিলেক্ট করুন।</p>
        <Link href="/" className="bg-[#16a085] text-white px-6 py-2.5 rounded-md font-semibold">
          হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.src || '/logo.png';
  const regularPrice = product.regular_price ? `৳ ${product.regular_price}` : '';
  const salePrice = product.price ? `৳ ${product.price}` : '';

  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* প্রোডাক্ট ইমেজ */}
        <div className="relative w-full h-[380px] sm:h-[480px] bg-gray-100 rounded-lg overflow-hidden border">
          {product.on_sale && (
            <span className="absolute top-3 left-3 bg-[#8e44ad] text-white text-xs px-2.5 py-1 rounded font-bold z-10">
              Sale!
            </span>
          )}
          <Image 
            src={imageUrl} 
            alt={product.name} 
            fill 
            priority
            className="object-cover w-full h-full" 
          />
        </div>

        {/* প্রোডাক্টের নাম */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
          {product.name}
        </h1>

        {/* দাম */}
        <div className="flex items-center gap-3">
          {regularPrice && regularPrice !== salePrice && (
            <span className="text-gray-400 line-through text-base sm:text-lg">{regularPrice}</span>
          )}
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{salePrice}</span>
        </div>

        <div className="inline-block border border-gray-300 rounded px-4 py-2 text-center text-gray-700 font-semibold bg-gray-50">
          1
        </div>

        <hr className="border-gray-200 my-6" />

        {/* ক্যাটাগরি */}
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Category:</span> {product.categories?.map(c => c.name).join(', ') || 'General'}
        </div>

        {/* ডেসক্রিপশন ট্যাব */}
        <div className="border-b border-gray-200 flex gap-8 text-sm sm:text-base font-semibold pt-4">
          <button className="text-[#0066cc] border-b-2 border-[#0066cc] pb-2 cursor-pointer">
            Description
          </button>
          <button className="text-gray-400 pb-2 cursor-pointer">
            Reviews (0)
          </button>
        </div>

        {/* বিবরণী */}
        <div 
          className="text-gray-800 text-sm sm:text-base leading-relaxed space-y-4 pt-2 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description || product.short_description || 'কোনো বিবরণ নেই।' }}
        />

      </div>

      {/* ফিক্সড কার্ট ও অর্ডার বাটন */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-50 flex gap-3 max-w-2xl mx-auto">
        <Link href={`/checkout?id=${product.id}`} className="flex-1">
          <button className="w-full bg-[#333333] hover:bg-black text-white font-bold py-3 px-4 rounded-md text-center transition text-sm sm:text-base cursor-pointer">
            কার্ট (Cart)
          </button>
        </Link>
        <Link href={`/checkout?id=${product.id}`} className="flex-1">
          <button className="w-full bg-[#00cc00] hover:bg-green-600 text-white font-extrabold py-3 px-4 rounded-md text-center transition text-sm sm:text-base cursor-pointer shadow-sm">
            অর্ডার করুন
          </button>
        </Link>
      </div>
    </main>
  );
}