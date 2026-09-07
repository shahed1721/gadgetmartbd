'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../components/CartContext';

// ডাইনামিক বা ব্যাকআপসহ সেফ ক্রেডেনশিয়াল সেট করা হলো
const CK = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "ck_02c16fdb3753d157bd7a89ddbdeb17790d59978c";
const CS = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "cs_9ea7ec03a2e976a3da5fb5ec2ce351f64dd1f16d";
const DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://admin.gadgetmartbd.shop";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const singleId = searchParams.get('id'); 
  const { cart } = useCart();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const deliveryCharge = 120;

  const debounceTimeout = useRef(null);
  
  // InitiateCheckout একবারই ফায়ার করার জন্য একটি রেফারেন্স
  const hasFiredInitiateCheckout = useRef(false);

  useEffect(() => {
    async function loadCheckoutItems() {
      if (singleId && cart.length === 0) {
        try {
          const res = await fetch(`${DOMAIN}/wp-json/wc/v3/products/${singleId}?consumer_key=${CK}&consumer_secret=${CS}`);
          if (res.ok) {
            const data = await res.json();
            
            let imgSrc = data.images?.[0]?.src || '/logo.png';
            if (imgSrc && DOMAIN) {
              const parts = imgSrc.split('/wp-content/');
              if (parts.length > 1) {
                imgSrc = `${DOMAIN}/wp-content/${parts[1]}`;
              }
            }

            setCheckoutItems([{
              id: data.id,
              name: data.name,
              price: Number(data.price || data.regular_price) || 0,
              image: imgSrc,
              quantity: 1
            }]);
          }
        } catch (error) {
          console.error("Single product fetch error:", error);
        }
      } else {
        const updatedCart = cart.map(item => {
          let imgSrc = item.image || '/logo.png';
          if (imgSrc && DOMAIN) {
            const parts = imgSrc.split('/wp-content/');
            if (parts.length > 1) {
              imgSrc = `${DOMAIN}/wp-content/${parts[1]}`;
            }
          }
          return { ...item, image: imgSrc };
        });
        setCheckoutItems(updatedCart);
      }
      setLoading(false);
    }

    loadCheckoutItems();
  }, [singleId, cart]);

  // ==========================================
  // INITIATE CHECKOUT EVENT (ব্রাউজার এবং CAPI)
  // ==========================================
  useEffect(() => {
    if (checkoutItems.length > 0 && !hasFiredInitiateCheckout.current) {
      hasFiredInitiateCheckout.current = true; // এটি নিশ্চিত করবে যে ইভেন্টটি একবারই ফায়ার হবে

      const subTotal = checkoutItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
      
      const initiateData = {
        value: subTotal,
        currency: 'BDT',
        content_ids: checkoutItems.map(item => String(item.id)),
        content_type: 'product',
        num_items: checkoutItems.length
      };

      // ব্রাউজার সাইড InitiateCheckout ফায়ার
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', initiateData);
      }

      // সার্ভার সাইড InitiateCheckout ফায়ার (আগের তৈরি করা API ব্যবহার করে)
      fetch('/api/track-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'InitiateCheckout',
          eventData: {
            custom_data: initiateData
          }
        })
      }).catch(err => console.log('CAPI InitiateCheckout Error:', err));
    }
  }, [checkoutItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (updatedData.phone.length > 4 || updatedData.name.length > 2) {
      clearTimeout(debounceTimeout.current);

      debounceTimeout.current = setTimeout(async () => {
        let sessionId = localStorage.getItem('wiot_session');
        if (!sessionId) {
          sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('wiot_session', sessionId);
        }

        try {
          await fetch('/api/incomplete-orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true, 
            body: JSON.stringify({
              session_id: sessionId,
              name: updatedData.name,
              phone: updatedData.phone,
              address: updatedData.address,
              cart_data: checkoutItems
            })
          });
        } catch (err) {
          console.error("Tracking error:", err);
        }
      }, 1000); 
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;

    if (!formData.phone || formData.phone.length < 11) {
      alert("দয়া করে সঠিক ১১ ডিজিটের ফোন নম্বর দিন।");
      return;
    }

    setSubmitting(true);

    try {
      const verifyRes = await fetch('/api/verify-courier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success && verifyData.redirectUrl) {
        window.location.href = verifyData.redirectUrl;
        return;
      }

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
        
        const subTotal = checkoutItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
        const totalPrice = subTotal + deliveryCharge;
        
        const purchaseData = {
          value: totalPrice,
          currency: 'BDT',
          content_ids: checkoutItems.map(item => String(item.id)),
          content_type: 'product',
          num_items: checkoutItems.length
        };

        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Purchase', purchaseData);
        }

        fetch('/api/track-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            eventName: 'Purchase',
            eventData: {
              user_data: {
                fn: formData.name,
                ph: formData.phone,
                st: formData.address
              },
              custom_data: purchaseData
            }
          })
        }).catch(err => console.log('CAPI Trigger Error:', err));

        const sessionId = localStorage.getItem('wiot_session');
        if (sessionId) {
          await fetch(`/api/incomplete-orders?session_id=${sessionId}`, { method: 'DELETE' });
        }
        localStorage.removeItem('wiot_session');
      } else {
        const errorData = await res.json();
        console.error("WP Order Error:", errorData);
        alert("অর্ডার পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error("Order process error:", error);
      alert("নেটওয়ার্ক সমস্যা। দয়া করে আবার চেষ্টা করুন।");
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