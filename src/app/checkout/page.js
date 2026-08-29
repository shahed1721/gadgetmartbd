"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ফর্ম ফিল্ডের স্টেট
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // ব্রাউজার থেকে কার্ট ডেটা লোড করা
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = JSON.parse(localStorage.getItem("gadget_cart")) || [];
      setCartItems(savedCart);
    }
  }, []);

  // সাবটোটাল হিসাব করা
  const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const shippingFee = 120; // ডেলিভারি চার্জ
  const total = subtotal + (cartItems.length > 0 ? shippingFee : 0);

  // অর্ডার প্লেস করার ফাংশন
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("আপনার কার্টে কোনো প্রোডাক্ট নেই!");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      alert("দয়া করে নাম, ফোন নাম্বার এবং সম্পূর্ণ ঠিকানা পূরণ করুন।");
      return;
    }

    setLoading(true);

    // WooCommerce API ফরম্যাট অনুযায়ী অর্ডার ডেটা তৈরি
    const orderData = {
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      set_paid: false,
      billing: {
        first_name: formData.name,
        address_1: formData.address,
        phone: formData.phone,
        country: "BD",
      },
      shipping: {
        first_name: formData.name,
        address_1: formData.address,
        country: "BD",
      },
      line_items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: shippingFee.toString(),
        }
      ]
    };

    const ck = "ck_e8bee42940cb29849845a1b7b1f2b057caac6db0";
    const cs = "cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc";
    const domain = "https://gadgetmartbd.shop";

    try {
      const res = await fetch(`${domain}/wp-json/wc/v3/orders?consumer_key=${ck}&consumer_secret=${cs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 অভিনন্দন! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।");
        localStorage.removeItem("gadget_cart"); // অর্ডার সফল হলে কার্ট খালি করা
        window.location.href = "/"; // হোমপেজে রিডাইরেক্ট
      } else {
        alert("অর্ডার করতে সমস্যা হয়েছে: " + (data.message || "দয়া করে আবার চেষ্টা করুন।"));
      }
    } catch (error) {
      alert("নেটওয়ার্ক সমস্যা! ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* হেডার */}
      <header className="bg-[#e6f7eb] sticky top-0 z-50 shadow-sm pb-2">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-grow flex justify-center pl-4">
            <Link href="/">
              <img src="/logo.png" alt="Gadget Mart BD" className="h-8 md:h-10 object-contain" />
            </Link>
          </div>
          
          <div className="relative">
            <Link href="/checkout" className="text-gray-700 relative flex items-center justify-center border border-gray-400 p-1 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </Link>
          </div>
        </div>
        
        <div className="px-4 flex justify-end">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
          
          {/* বাম পাশ: Billing Details */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl mb-6 text-gray-800">Billing details</h2>
            
            <div className="space-y-5">
              {/* নাম */}
              <div>
                <label className="block text-[15px] font-bold text-black mb-2">
                  আপনার নাম <span className="text-red-600">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="আপনার নাম লিখুন" 
                  className="w-full border border-red-400 rounded-sm p-3 focus:outline-none text-[15px]"
                  required
                />
              </div>

              {/* ফোন নাম্বার */}
              <div>
                <label className="block text-[15px] font-bold text-black mb-2">
                  ফোন নাম্বার <span className="text-red-600">*</span>
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="ফোন নাম্বার লিখুন" 
                  className="w-full border border-red-400 rounded-sm p-3 focus:outline-none text-[15px]"
                  required
                />
              </div>

              {/* ঠিকানা */}
              <div>
                <label className="block text-[15px] font-bold text-black mb-2">
                  সম্পূর্ণ ঠিকানা <span className="text-red-600">*</span>
                </label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন" 
                  className="w-full border border-green-500 rounded-sm p-3 focus:outline-none focus:border-green-600 text-[15px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* ডান পাশ: Your Order */}
          <div className="w-full lg:w-1/2">
            <div className="border border-gray-300 p-5 md:p-6 rounded-sm bg-white">
              <h2 className="text-xl mb-5 text-gray-800">Your order</h2>
              
              <table className="w-full text-[15px] text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="pb-3 font-semibold text-gray-800 w-2/3">Product</th>
                    <th className="pb-3 font-semibold text-gray-800 text-right w-1/3">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="py-6 text-center text-gray-500">
                        আপনার কার্টে কোনো প্রোডাক্ট নেই! <br/>
                        <Link href="/" className="text-teal-600 underline font-semibold mt-2 inline-block">কেনাকাটা শুরু করুন</Link>
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item, index) => (
                      <tr key={index} className="py-4">
                        <td colSpan="2" className="py-4">
                          <img src={item.image} alt={item.name} className="w-14 h-14 border object-contain mb-3 bg-gray-50 rounded" />
                          <div className="flex justify-between items-start gap-4">
                            <span className="text-gray-600 leading-relaxed">
                              {item.name} <br/>
                              <span className="text-gray-800 font-bold">× {item.quantity}</span>
                            </span>
                            <span className="text-gray-600 whitespace-nowrap mt-1 font-bold">
                              {(parseFloat(item.price) * item.quantity).toFixed(2)}৳
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  
                </tbody>
                <tfoot className="text-gray-600">
                  <tr className="border-t border-gray-300">
                    <td className="py-4">Subtotal</td>
                    <td className="py-4 text-right font-bold">{subtotal.toFixed(2)}৳</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-4">Shipment</td>
                    <td className="py-4 text-right text-sm">Delivery charge:<br/><strong className="text-black text-[15px] font-semibold">{shippingFee}.00৳</strong></td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-4 text-gray-800 font-bold">Total</td>
                    <td className="py-4 text-right text-gray-800 font-black text-lg">{total.toFixed(2)}৳</td>
                  </tr>
                </tfoot>
              </table>

              {/* Payment Method */}
              <div className="mt-6">
                <p className="text-[15px] text-gray-800 mb-2 font-semibold">Cash on delivery</p>
                <div className="bg-[#f2f2f2] p-4 text-[14px] text-gray-700 relative rounded-sm mt-3">
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-[#f2f2f2] rotate-45"></div>
                  <p className="relative z-10">Pay with cash upon delivery.</p>
                </div>
              </div>

              {/* Privacy Policy */}
              <p className="text-[14px] text-gray-700 mt-6 leading-relaxed">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link href="#" className="text-[#df00b9] hover:underline font-medium">privacy policy</Link>.
              </p>

              {/* Place Order Button */}
              <button 
                type="submit" 
                disabled={loading || cartItems.length === 0}
                className="w-full mt-6 bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 rounded text-[16px] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? "অর্ডার প্রসেসিং হচ্ছে..." : "Place order"}
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}