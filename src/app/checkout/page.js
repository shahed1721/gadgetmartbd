'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../components/CartContext';

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';
const DOMAIN = 'https://gadgetmartbd.shop';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const singleId = searchParams.get('id'); // ইউআরএলে আইডি থাকতে পারে (Buy Now এর জন্য)
  const { cart } = useCart();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const deliveryCharge = 120;

  useEffect(() => {
    async function loadCheckoutItems() {
      // যদি ইউআরএলে সিঙ্গেল আইডি থাকে (Order Now থেকে আসা) এবং কার্ট খালি থাকে, তবে ওই প্রোডাক্টটি ফেচ করব
      if (singleId && cart.length === 0) {
        try {
          const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products/${singleId}?consumer_key=${CK}&consumer_secret=${CS}`);
          if (res.ok) {
            const data = await res.json();
            setCheckoutItems([{
              id: data.id,
              name: data.name,
              price: Number(data.price || data.regular_price) || 0,
              image: data.images?.[0]?.src || '/logo.png',
              quantity: 1
            }]);
          }
        } catch (error) {
          console.error("Single product fetch error:", error);
        }
      } else {
        // অন্যথায় কার্টে থাকা সমস্ত প্রোডাক্ট দেখাবে
        setCheckoutItems(cart);
      }
      setLoading(false);
    }

    loadCheckoutItems();
  }, [singleId, cart]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;

    // ফোন নম্বর ভ্যালিডেশন (অবশ্যই ১১ ডিজিট হতে হবে)
    if (!formData.phone || formData.phone.length < 11) {
      alert("দয়া করে সঠিক ১১ ডিজিটের ফোন নম্বর দিন।");
      return;
    }

    setSubmitting(true);

    try {
      // ==========================================
      // ১. কুরিয়ার হিস্ট্রি চেক (নতুন লজিক যুক্ত করা হলো)
      // ==========================================
      const verifyRes = await fetch('/api/verify-courier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });

      const verifyData = await verifyRes.json();

      // যদি ফ্রড বা নতুন কাস্টমার হয়, তবে 리ডাইরেক্ট করে দেবে (WooCommerce এ অর্ডার যাবে না)
      if (verifyData.success && verifyData.redirectUrl) {
        window.location.href = verifyData.redirectUrl;
        return; // এখানেই থেমে যাবে
      }

      // ==========================================
      // ২. ভালো কাস্টমার হলে WooCommerce এ অর্ডার প্লেস হবে (আপনার আগের লজিক)
      // ==========================================
      const lineItems = checkoutItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity || 1
      }));

      const orderData = {
        payment_method: "cod",
        payment_method_title: "Cash on delivery",
        set_paid: false,
        billing: { 
          first_name: formData.name, 
          address_1: formData.address, 
          phone: formData.phone 
        },
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
        localStorage.removeItem('cart');
      } else {
        alert("অর্ডার পাঠাতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Order process error:", error);
      alert("নেটওয়ার্ক সমস্যা। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">অর্ডার পেজ লোড হচ্ছে...</div>;
  if (checkoutItems.length === 0) return (
    <div className="text-center py-20 text-gray-500 max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
      <p className="mb-4">আপনার চেকআউট করার মতো কোনো প্রোডাক্ট নেই!</p>
      <Link href="/" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold inline-block">
        হোমপেজে ফিরে যান
      </Link>
    </div>
  );

  const subTotal = checkoutItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const totalPrice = subTotal + deliveryCharge;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border max-w-2xl mx-auto">
      {orderSuccess ? (
        <div className="bg-green-50 border border-green-400 text-green-800 p-6 rounded-lg text-center">
          <h2 className="font-bold text-2xl mb-2">আপনার অর্ডারটি সফল হয়েছে!</h2>
          <p className="text-sm">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
          <Link href="/" className="inline-block mt-4 text-teal-600 font-semibold underline">হোমপেজে ফিরে যান</Link>
        </div>
      ) : (
        <form onSubmit={handleOrderSubmit} className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Billing details</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">আপনার নাম *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="আপনার নাম লিখুন" className="w-full border rounded-md p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ফোন নম্বর *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="017XXXXXXXX" className="w-full border rounded-md p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
              <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="সম্পূর্ণ ঠিকানা লিখুন" className="w-full border rounded-md p-2.5 text-sm" />
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 space-y-3 text-sm">
            <h3 className="font-bold text-gray-800 border-b pb-2">Your order ({checkoutItems.length} items)</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 bg-white border rounded overflow-hidden flex-shrink-0">
                      <Image src={item.image || '/logo.png'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="font-medium text-xs text-gray-800 line-clamp-1" dangerouslySetInnerHTML={{ __html: item.name }} />
                      <span className="text-[11px] text-gray-500">কোয়ান্টিটি: {item.quantity || 1}</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs">৳ {Number(item.price) * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t pt-2 text-xs text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold">৳ {subTotal}</span>
            </div>

            <div className="flex justify-between border-t pt-2 text-xs text-gray-600">
              <span>Shipment (Delivery charge)</span>
              <span className="font-bold">৳ {deliveryCharge}</span>
            </div>

            <div className="flex justify-between border-t pt-2 font-bold text-base text-gray-900">
              <span>Total</span>
              <span className="text-teal-600">৳ {totalPrice}</span>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition text-sm uppercase cursor-pointer">
            {submitting ? 'প্রসেসিং হচ্ছে...' : 'Place order'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <Suspense fallback={<div className="text-center py-20">লোড হচ্ছে...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}