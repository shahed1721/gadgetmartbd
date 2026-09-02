import Image from 'next/image';
import Link from 'next/link';

// ১ ঘণ্টা (৩৬০০ সেকেন্ড) পর্যন্ত সার্ভারে ডেটা ফিক্সড ক্যাশ থাকবে। এর মধ্যে কোনো রিলোড বা রিফ্রেশে লোডিং নেবে না!
export const revalidate = 3600;

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';
const DOMAIN = 'https://gadgetmartbd.shop';

async function getData() {
  try {
    const [prodRes, catRes] = await Promise.all([
      fetch(`${DOMAIN}/wp-json/wc/v3/products?per_page=100&consumer_key=${CK}&consumer_secret=${CS}`, { 
        next: { revalidate: 3600 } 
      }),
      fetch(`${DOMAIN}/wp-json/wc/v3/products/categories?hide_empty=true&consumer_key=${CK}&consumer_secret=${CS}`, { 
        next: { revalidate: 3600 } 
      })
    ]);

    const products = prodRes.ok ? await prodRes.json() : [];
    const categories = catRes.ok ? await catRes.json() : [];

    return { products, categories };
  } catch (error) {
    return { products: [], categories: [] };
  }
}

export default async function Home() {
  const { products, categories } = await getData();

  return (
    <main className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      
      {/* টপ নোটিফিকেশন বার */}
      <div className="bg-emerald-600 text-white text-center py-2 text-xs md:text-sm font-semibold">
        সারা বাংলাদেশে দ্রুত ডেলিভারি • ক্যাশ অন ডেলিভারি • প্রিমিয়াম কোয়ালিটি
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 space-y-10">
        
        {/* ব্যানার সেকশন */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-2xl p-6 md:p-12 text-center space-y-4 shadow-md">
          <span className="bg-red-600 text-xs px-4 py-1.5 rounded-full uppercase font-bold tracking-widest shadow-sm">
            ⚡ সেরা গ্যাজেট ও অ্যাক্সেসরিজ
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold mt-4">স্মার্ট লাইফস্টাইলের জন্য সেরা পছন্দ</h1>
          <p className="text-xs md:text-sm text-gray-200">আপনার পছন্দের গ্যাজেটগুলো লুফে নিন আকর্ষণীয় মূল্যে।</p>
        </div>

        {/* ক্যাটাগরি সেকশন */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">ক্যাটাগরি সমূহ</h2>
          <div className="flex justify-start md:justify-center items-start gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Link href={`/category/${cat.id}`} key={cat.id} className="flex flex-col items-center flex-shrink-0 group w-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-sm border-2 border-teal-100 overflow-hidden group-hover:border-teal-500 group-hover:shadow-md transition duration-300 flex items-center justify-center">
                    {cat.image?.src ? (
                      <Image src={cat.image.src} alt={cat.name} width={80} height={80} className="object-cover w-full h-full group-hover:scale-110 transition duration-300" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <span className="text-[11px] md:text-xs font-semibold text-gray-700 mt-3 text-center leading-tight group-hover:text-teal-600 transition">{cat.name}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500">কোনো ক্যাটাগরি নেই।</p>
            )}
          </div>
        </div>

        {/* প্রোডাক্টস গ্রিড */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6 border-b pb-3">আমাদের ট্রেন্ডিং প্রোডাক্টসমূহ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {products && products.length > 0 ? (
              products.map((product) => {
                const imageUrl = product.images?.[0]?.src || '/logo.png';
                const regularPrice = product.regular_price ? `৳ ${product.regular_price}` : '';
                const price = product.price ? `৳ ${product.price}` : '';

                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-lg transition overflow-hidden flex flex-col justify-between group">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative h-44 sm:h-56 md:h-64 w-full bg-gray-100 overflow-hidden">
                        <Image src={imageUrl} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition duration-500" />
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 h-9 md:h-10 leading-snug group-hover:text-teal-600 transition" dangerouslySetInnerHTML={{ __html: product.name }} />
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          {regularPrice && regularPrice !== price && (
                            <span className="text-[10px] md:text-xs text-gray-400 line-through">{regularPrice}</span>
                          )}
                          <span className="text-sm md:text-base font-extrabold text-teal-600">{price}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-3 pt-0 mt-auto">
                      <Link 
                        href={`/checkout?id=${product.id}`}
                        className="w-full bg-[#ff0000] hover:bg-red-700 text-white text-[11px] md:text-sm font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition uppercase tracking-wider shadow-sm"
                      >
                        ⚡ BUY NOW
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center col-span-full text-gray-500 py-10">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}