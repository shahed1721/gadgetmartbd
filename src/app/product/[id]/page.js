'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';
const DOMAIN = 'https://gadgetmartbd.shop';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProductDetail() {
      try {
        const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products/${id}?consumer_key=${CK}&consumer_secret=${CS}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Product detail fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">প্রোডাক্ট লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">প্রোডাক্টটি পাওয়া যায়নি!</h2>
        <p className="text-gray-600 mb-4">দয়া করে সঠিক প্রোডাক্টে প্রবেশ করুন।</p>
        <Link href="/" className="bg-[#16a085] text-white px-6 py-2.5 rounded-md font-semibold">
          হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.src || '/logo.png';
  const regularPrice = product.regular_price ? `৳ ${product.regular_price}` : '';
  const price = product.price ? `৳ ${product.price}` : '';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-6 md:p-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* প্রোডাক্ট ইমেজ */}
          <div className="relative h-72 md:h-96 w-full bg-gray-100 rounded-xl overflow-hidden border">
            <Image src={imageUrl} alt={product.name} fill className="object-contain p-4" />
          </div>

          {/* প্রোডাক্ট ডিটেইলস */}
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800" dangerouslySetInnerHTML={{ __html: product.name }} />
            
            <div className="flex items-center gap-3">
              {regularPrice && regularPrice !== price && (
                <span className="text-sm text-gray-400 line-through">{regularPrice}</span>
              )}
              <span className="text-2xl font-extrabold text-[#16a085]">{price}</span>
            </div>

            <div className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: product.short_description || product.description || 'কোনো বিবরণ নেই।' }} />

            <div className="pt-4">
              <Link href={`/checkout?id=${product.id}`} className="block w-full">
                <button className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition text-center shadow">
                  অর্ডার করুন (Buy Now)
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}