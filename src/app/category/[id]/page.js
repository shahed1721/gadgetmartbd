import Link from "next/link";

export const revalidate = 3600;

const ck = "ck_e8bee42940cb29849845a1b7b1f2b057caac6db0";
const cs = "cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc";
const domain = "https://gadgetmartbd.shop";

export async function generateStaticParams() {
  const res = await fetch(`${domain}/wp-json/wc/v3/products/categories?hide_empty=true&consumer_key=${ck}&consumer_secret=${cs}`);
  const categories = await res.json();
  return categories.map((cat) => ({ id: cat.id.toString() }));
}

async function getCategoryProducts(categoryId) {
  try {
    const res = await fetch(
      `${domain}/wp-json/wc/v3/products?category=${categoryId}&consumer_key=${ck}&consumer_secret=${cs}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const products = await getCategoryProducts(resolvedParams.id);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between">
      
      {/* মূল কন্টেন্ট */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-lg">এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই!</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => {
              const imgSrc = product.images && product.images.length > 0 ? product.images[0].src : null;

              return (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-[#16a085] p-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <Link href={`/product/${product.id}`} className="h-40 w-full flex items-center justify-center relative cursor-pointer block bg-white">
                    {imgSrc ? (
                      <img src={imgSrc} alt={product.name} className="object-contain h-full w-full" loading="lazy" />
                    ) : (
                      <span className="text-gray-300 text-xs">No Image</span>
                    )}
                  </Link>

                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-gray-700 text-sm my-2 line-clamp-2 hover:text-teal-600">{product.name}</h3>
                  </Link>

                  <div className="text-center mt-auto">
                    <p className="text-[#16a085] font-bold text-base mb-2">{product.price}৳</p>
                    <Link href="/checkout" className="block w-full">
                      <button className="w-full bg-[#ff0000] text-white text-sm font-bold py-2 rounded-md hover:bg-red-700">
                        অর্ডার করুন
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}