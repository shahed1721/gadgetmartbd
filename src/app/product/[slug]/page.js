import ProductDetails from './ProductDetails';

export default async function ProductPage({ params }) {
  const slug = params.slug;

  const CK = process.env.WC_CONSUMER_KEY;
  const CS = process.env.WC_CONSUMER_SECRET;
  const DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  // revalidate: 60 মানে ভার্সেল ডেটা ক্যাশ করে রাখবে, যার ফলে ক্লিক করলেই পেজ ইনস্ট্যান্ট লোড হবে
  const res = await fetch(
    `${DOMAIN}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}`,
    { next: { revalidate: 60 } } 
  );

  let product = null;
  if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      product = data[0];
    }
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
          <span className="text-5xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">প্রোডাক্টটি পাওয়া যায়নি!</h2>
          <Link href="/" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full block shadow-md">
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}