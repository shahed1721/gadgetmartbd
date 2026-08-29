'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const CK = 'ck_e8bee42940cb29849845a1b7b1f2b057caac6db0';
const CS = 'cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc';
const DOMAIN = 'https://gadgetmartbd.shop';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const deliveryCharge = 120;

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        try {
          const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products/${id}?consumer_key=${CK}&consumer_secret=${CS}`);
          if (res.ok) {
            const data = await res.json();
            setProduct(data);
          }
        } catch (error) {
          console.error("Checkout product fetch error:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);

    const orderData = {
      payment_method: "cod",
      payment_method_title: "Cash on delivery",
      set_paid: false,
      billing: { first_name: formData.name, address_1: formData.address, phone: formData.phone },
      line_items: [{ product_id: product.id, quantity: 1 }],
      shipping_lines: [{ method_id: "flat_rate", method_title: "Delivery charge", total: deliveryCharge.toString() }]
    };

    try {
      const res = await fetch(`${DOMAIN}/wp-json/wc/v3/orders?consumer_key=${CK}&consumer_secret=${CS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        setOrderSuccess(true);
      } else {
        alert("অর্ডার পাঠাতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      alert("নেটওয়ার্ক সমস্যা।");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">অর্ডার পেজ লোড হচ্ছে...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">কোনো প্রোডাক্ট সিলেক্ট করা হয়নি! অনুগ্রহ করে হোমপেজ থেকে বাই নাও বাটনে ক্লিক করুন।</div>;

  const imageUrl = product.images?.[0]?.src || '/logo.png';
  const productPrice = Number(product.price || product.sale_price) || 0;
  const totalPrice = productPrice + deliveryCharge;

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
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="ফোন নম্বর লিখুন" className="w-full border rounded-md p-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
              <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="সম্পূর্ণ ঠিকানা লিখুন" className="w-full border rounded-md p-2.5 text-sm" />
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 space-y-3 text-sm">
            <h3 className="font-bold text-gray-800 border-b pb-2">Your order</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 bg-white border rounded overflow-hidden flex-shrink-0">
                  <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                </div>
                <span className="font-medium text-xs text-gray-800 line-clamp-1">{product.name}</span>
              </div>
              <span className="font-bold">৳ {productPrice}</span>
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