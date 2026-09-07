import Link from 'next/link';
import ProductDetails from './ProductDetails';

export const revalidate = 3600;
export const dynamicParams = true;

const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;
const DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products?per_page=50&consumer_key=${CK}&consumer_secret=${CS}`);
    if (!res.ok) return [];
    const products = await res.json();
    
    return products.map((product) => ({
      slug: product.slug, 
    }));
  } catch (error) {
    return [];
  }
}

async function getProduct(slug) {
  try {
    const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${CK}&consumer_secret=${CS}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

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

  return <ProductDetails product={product} />;
}