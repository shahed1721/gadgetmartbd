import Link from 'next/link';
import Image from 'next/image';
import AddToCartBtn from '../components/AddToCartBtn';

export const revalidate = 3600;

// ডাইনামিক এনভায়রনমেন্ট ভেরিয়েবল কল করা হলো
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;
const DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export default async function ShopPage() {
  let products = [];
  try {
    // এখানে সরাসরি লিংকের বদলে DOMAIN ব্যবহার করা হয়েছে
    const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products?per_page=40&consumer_key=${CK}&consumer_secret=${CS}`);
    if (res.ok) products = await res.json();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-800 text-center">🛍️ All Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col overflow-hidden">
            
            {/* ছবির লিংকে id এর বদলে slug ব্যবহার করা হলো */}
            <Link href={`/product/${product.slug}`} className="block relative w-full pt-[100%] bg-gray-50 group">
              <Image src={product.images?.[0]?.src || '/logo.png'} alt={product.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform" />
            </Link>

            <div className="p-3 flex flex-col flex-grow">
              
              {/* প্রোডাক্ট নামের লিংকে id এর বদলে slug ব্যবহার করা হলো */}
              <Link href={`/product/${product.slug}`}>
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
    </div>
  );
}