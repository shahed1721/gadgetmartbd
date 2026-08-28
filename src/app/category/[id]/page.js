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
      
      {/* হোম পেজের হুবহু হেডার */}
      <header className="bg-[#e6f7eb] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <button className="block md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <nav className="hidden md:flex space-x-6 text-gray-700 font-semibold">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <Link href="/#all-products" className="hover:text-teal-600">Shop</Link>
            <Link href="/#categories" className="hover:text-teal-600">Categories</Link>
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
              <button className="text-gray-700 relative flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

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

      {/* হোম পেজের হুবহু ফুটার */}
      <footer className="bg-[#bfdbfe] text-center pt-8 pb-12 px-4 text-[#334155] text-sm md:text-base leading-relaxed relative mt-10">
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