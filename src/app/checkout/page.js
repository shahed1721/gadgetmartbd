"use client";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* হেডার (স্ক্রিনশটের মতো মোবাইল লেআউট) */}
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
            <button className="text-gray-700 relative flex items-center justify-center border border-gray-400 p-1 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">1</span>
            </button>
          </div>
        </div>
        
        {/* হেডারের নিচে সার্চ আইকন */}
        <div className="px-4 flex justify-end">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* বাম পাশ: Billing Details */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl mb-6 text-gray-800">Billing details</h2>
            
            <form className="space-y-5">
              {/* নাম */}
              <div>
                <label className="block text-[15px] font-bold text-black mb-2">
                  আপনার নাম <span className="text-red-600">*</span>
                </label>
                <input 
                  type="text" 
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
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন" 
                  className="w-full border border-green-500 rounded-sm p-3 focus:outline-none focus:border-green-600 text-[15px]"
                  required
                />
              </div>
            </form>
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
                  
                  {/* প্রোডাক্ট ডিটেইলস (স্ক্রিনশটের মতো মোবাইল ফ্রেন্ডলি) */}
                  <tr className="py-4">
                    <td colSpan="2" className="py-4">
                      <img src="/logo.png" alt="Product" className="w-14 h-14 border object-contain mb-3" />
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-600 leading-relaxed">
                          AQSA BOOM Wireless Neckband Earphones with 5 Voice Change, LED Display & 500 Hours Playback (V5.4) <br/>
                          <span className="text-gray-800">× 1</span>
                        </span>
                        <span className="text-gray-600 whitespace-nowrap mt-1">699.00৳</span>
                      </div>
                    </td>
                  </tr>
                  
                </tbody>
                <tfoot className="text-gray-600">
                  <tr className="border-t border-gray-300">
                    <td className="py-4">Subtotal</td>
                    <td className="py-4 text-right">699.00৳</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-4">Shipment</td>
                    <td className="py-4 text-right text-sm">Delivery charge:<br/><strong className="text-black text-[15px] font-semibold">120.00৳</strong></td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-4 text-gray-800">Total</td>
                    <td className="py-4 text-right text-gray-800">819.00৳</td>
                  </tr>
                </tfoot>
              </table>

              {/* Payment Method */}
              <div className="mt-6">
                <p className="text-[15px] text-gray-800 mb-2">Cash on delivery</p>
                
                {/* Arrow Box Design */}
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
              <button className="w-full mt-6 bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3.5 rounded text-[16px] transition-colors shadow-sm">
                Place order
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}