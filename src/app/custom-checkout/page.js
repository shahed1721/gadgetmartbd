'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useCart } from '../components/CartContext'; // আপনার কার্ট কনটেক্সট পাথ ঠিক আছে কিনা খেয়াল করবেন

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';
const DOMAIN = 'https://gadgetmartbd.shop';

function CustomCheckoutContent() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', trxId: '' });
  const deliveryCharge = 120;

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (!formData.phone || formData.phone.length < 11) {
      alert("দয়া করে সঠিক ১১ ডিজিটের ফোন নম্বর দিন।");
      return;
    }
    if (!formData.trxId) {
      alert("দয়া করে আপনার পেমেন্ট ট্রানজেকশন আইডি বা যে নাম্বার থেকে টাকা পাঠিয়েছেন সেটি দিন।");
      return;
    }

    setSubmitting(true);

    try {
      const lineItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity || 1
      }));

      const orderData = {
        payment_method: "bacs", // Advance payment
        payment_method_title: "Advance Payment (bKash/Nagad)",
        set_paid: false,
        billing: { 
          first_name: formData.name, 
          address_1: formData.address, 
          phone: formData.phone 
        },
        // অর্ডার নোটে ট্রানজেকশন আইডি চলে যাবে
        customer_note: `Advance Payment Note / TrxID: ${formData.trxId}`,
        line_items: lineItems,
        shipping_lines: [{ 
          method_id: "flat_rate", 
          method_title: "Delivery charge", 
          total: deliveryCharge.toString() 
        }]
      };

      const res = await fetch(`${DOMAIN}/wp-json/wc/v3/orders?consumer_key=${CK}&consumer_secret=${CS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        setOrderSuccess(true);
        localStorage.removeItem('cart'); // সফল হলে কার্ট ক্লিয়ার
      } else {
        alert("অর্ডার প্রসেস করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Order process error:", error);
      alert("নেটওয়ার্ক সমস্যা। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">অর্ডার পেজ লোড হচ্ছে...</div>;
  if (cart.length === 0 && !orderSuccess) return (
    <div className="text-center py-20 text-gray-500 max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
      <p className="mb-4">আপনার কার্ট খালি!</p>
      <Link href="/" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold inline-block">
        হোমপেজে ফিরে যান
      </Link>
    </div>
  );

  const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const totalPrice = subTotal + deliveryCharge;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-t-4 border-teal-600 max-w-2xl mx-auto my-10 font-sans">
      {orderSuccess ? (
        <div className="bg-green-50 border border-green-400 text-green-800 p-8 rounded-lg text-center">
          <span className="text-5xl mb-4 block">🎉</span>
          <h2 className="font-bold text-2xl mb-2">আপনার অর্ডারটি সফল হয়েছে!</h2>
          <p className="text-sm">অ্যাডভান্স পেমেন্ট এবং অর্ডার কনফার্ম করার জন্য ধন্যবাদ। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।</p>
          <Link href="/" className="inline-block mt-6 bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700">
            শপে ফিরে যান
          </Link>
        </div>
      ) : (
        <form onSubmit={handleOrderSubmit} className="space-y-6">
          <div className="text-center mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">অর্ডার কনফার্মেশন ফর্ম</h2>
            <p className="text-sm text-teal-700 font-semibold mt-1">
              (শুধুমাত্র অ্যাডভান্স পেমেন্ট সম্পন্নকারী গ্রাহকদের জন্য)
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">আপনার নাম *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="আপনার নাম লিখুন" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">ফোন নম্বর *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="017XXXXXXXX" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
              <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            
            {/* ট্রানজেকশন আইডি ফিল্ড (সবচেয়ে গুরুত্বপূর্ণ) */}
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mt-2">
              <label className="block text-sm font-bold text-teal-800 mb-2">
                বিকাশ/নগদ ট্রানজেকশন আইডি (বা যে নাম্বার থেকে টাকা পাঠিয়েছেন) *
              </label>
              <input type="text" name="trxId" required value={formData.trxId} onChange={handleInputChange} placeholder="TrxID অথবা ফোন নাম্বার লিখুন" className="w-full border border-teal-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white" />
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 mt-6">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">আপনার অর্ডার ({cart.length} টি আইটেম)</h3>
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
              <span>সর্বমোট মূল্য:</span>
              <span className="text-teal-700">৳ {totalPrice}</span>
            </div>
          </div>

          <button type="submit" disabled={submitting} className={`w-full py-4 rounded-lg text-white font-bold text-lg transition shadow-md ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-700 hover:bg-teal-800 cursor-pointer'}`}>
            {submitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function CustomCheckoutPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <Suspense fallback={<div className="text-center py-20">লোড হচ্ছে...</div>}>
        <CustomCheckoutContent />
      </Suspense>
    </main>
  );
}