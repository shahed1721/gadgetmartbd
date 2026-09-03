import Link from 'next/link';
import Image from 'next/image';
import AddToCartBtn from '../components/AddToCartBtn';

export const revalidate = 3600;

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';

export default async function FlashSalePage() {
  let products = [];
  try {
    const res = await fetch(`https://gadgetmartbd.shop/wp-json/wc/v3/products?on_sale=true&per_page=40&consumer_key=${CK}&consumer_secret=${CS}`);
    if (res.ok) products = await res.json();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-yellow-50/30 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-red-600 text-center animate-pulse">⚡ FLASH SALE ⚡</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-red-100 flex flex-col overflow-hidden relative">
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">SALE</span>
            <Link href={`/product/${product.id}`} className="block relative w-full pt-[100%] bg-gray-50 group">
              <Image src={product.images?.[0]?.src || '/logo.png'} alt={product.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform" />
            </Link>
            <div className="p-3 flex flex-col flex-grow">
              <Link href={`/product/${product.id}`}>
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors mb-1" dangerouslySetInnerHTML={{ __html: product.name }} />
              </Link>
              <div className="mt-auto pt-2">
                <div className="flex gap-2 items-center mb-2">
                  <span className="text-red-600 font-extrabold text-lg">৳ {product.price}</span>
                  <span className="text-gray-400 line-through text-xs">৳ {product.regular_price}</span>
                </div>
                <AddToCartBtn product={product} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}