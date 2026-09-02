'use client';
import { useCart } from '../components/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // সাবটোটাল হিসাব করা
  const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">আপনার শপিং কার্ট 🛒</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4">আপনার কার্টটি বর্তমানে খালি!</p>
            <Link href="/" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold inline-block hover:bg-teal-700 transition">
              কেনাকাটা চালিয়ে যান
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                      <Image src={item.image || '/logo.png'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1" dangerouslySetInnerHTML={{ __html: item.name }} />
                      <p className="text-teal-600 font-bold text-sm mt-1">৳ {item.price} × {item.quantity || 1}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-gray-900">৳ {Number(item.price) * (item.quantity || 1)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="রিমুভ করুন"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-gray-800">
              <span>মোট (Subtotal):</span>
              <span className="text-teal-600">৳ {subTotal}</span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Link href="/" className="text-teal-600 font-semibold hover:underline text-sm">
                ← আরও কেনাকাটা করুন
              </Link>
              <Link href="/checkout" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-teal-500/30 transition">
                প্রোসিড টু চেকআউট ⚡
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}