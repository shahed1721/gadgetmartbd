import Link from "next/link";

export const revalidate = 3600;

const ck = "ck_e8bee42940cb29849845a1b7b1f2b057caac6db0";
const cs = "cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc";
const domain = "https://gadgetmartbd.shop";

export async function generateStaticParams() {
  const res = await fetch(`${domain}/wp-json/wc/v3/products?per_page=50&consumer_key=${ck}&consumer_secret=${cs}`);
  const products = await res.json();
  return products.map((product) => ({ id: product.id.toString() }));
}

async function getSingleProduct(id) {
  try {
    const res = await fetch(`${domain}/wp-json/wc/v3/products/${id}?consumer_key=${ck}&consumer_secret=${cs}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getSingleProduct(resolvedParams.id);

  if (!product) return <div className="p-10 text-center text-xl font-bold text-red-500">Product Not Found!</div>;

  const imageUrl = product.images && product.images.length > 0 ? product.images[0].src : "/logo.png";

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between pb-16 md:pb-0">
      <div>
        <div className="bg-[#00c853] text-white text-xs md:text-sm text-center py-2 font-medium">
          সারা বাংলাদেশে দ্রুত ডেলিভারি • ক্যাশ অন ডেলিভারি
        </div>

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

        <main className="max-w-4xl mx-auto px-4 py-6">
          
          {/* প্রোডাক্ট ইমেজ */}
          <div className="w-full h-80 md:h-[450px] relative bg-white rounded-lg overflow-hidden border flex items-center justify-center p-2">
            <img src={imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
          </div>

          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800" dangerouslySetInnerHTML={{ __html: product.name }} />
            <div className="flex items-center space-x-3 mt-2">
              {product.regular_price && (
                <span className="line-through text-gray-400 text-lg">{product.regular_price}৳</span>
              )}
              <span className="text-2xl font-black text-black">{product.price}৳</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Link href="/checkout" className="block w-full">
              <button className="w-full bg-[#00e676] hover:bg-green-600 text-white font-bold py-3 rounded-md text-lg shadow">
                অর্ডার করুন
              </button>
            </Link>
            <input type="number" defaultValue="1" min="1" className="w-16 border rounded-md p-2 text-center text-lg mx-auto block" />
          </div>

          <hr className="my-6" />

          {product.categories?.[0] && (
            <p className="text-sm text-gray-600 mb-4">
              Category: <span className="font-semibold text-gray-800">{product.categories[0].name}</span>
            </p>
          )}

          <div className="border-b pb-2 mb-4 flex space-x-6 text-sm md:text-base font-semibold">
            <span className="text-blue-600 border-b-2 border-blue-600 pb-2 cursor-pointer">Description</span>
            <span className="text-gray-500 cursor-pointer">Reviews (0)</span>
          </div>

          <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-2" dangerouslySetInnerHTML={{ __html: product.description || 'কোনো বিবরণ নেই।' }} />
        </main>
      </div>

      {/* মোবাইলের জন্য ফিক্সড নেভিগেশন বার (Cart এবং Buy বাটন) */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-2 z-50">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/checkout" className="w-full bg-gray-800 text-white font-bold py-2.5 px-2 rounded text-center text-xs uppercase flex items-center justify-center gap-1 shadow">
            🛒 Cart
          </Link>
          <Link href="/checkout" className="w-full bg-indigo-600 text-white font-bold py-2.5 px-2 rounded text-center text-xs uppercase flex items-center justify-center gap-1 shadow">
            ⚡ Buy
          </Link>
        </div>
      </div>

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