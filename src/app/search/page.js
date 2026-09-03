import Link from 'next/link';
import Image from 'next/image';
import AddToCartBtn from '../components/AddToCartBtn';

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.q || '';

  let products = [];
  if (query) {
    try {
      const res = await fetch(`https://gadgetmartbd.shop/wp-json/wc/v3/products?search=${query}&consumer_key=${CK}&consumer_secret=${CS}`, { cache: 'no-store' });
      if (res.ok) products = await res.json();
    } catch (error) {
      console.error("Search fetch error", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Search Results for: <span className="text-teal-600">&quot;{query}&quot;</span>
      </h1>
      
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">কোনো প্রোডাক্ট পাওয়া যায়নি। অন্য কোনো নাম দিয়ে খুঁজুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col overflow-hidden">
              <Link href={`/product/${product.id}`} className="block relative w-full pt-[100%] bg-gray-50 group">
                <Image src={product.images?.[0]?.src || '/logo.png'} alt={product.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform" />
              </Link>
              <div className="p-3 flex flex-col flex-grow">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-teal-600 transition-colors mb-1" dangerouslySetInnerHTML={{ __html: product.name }} />
                </Link>
                <div className="mt-auto pt-2">
                  <div className="text-teal-600 font-extrabold text-lg mb-2">৳ {product.price || product.regular_price}</div>
                  <AddToCartBtn product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}