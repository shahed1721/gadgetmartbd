'use client';
export default function TrackOrderPage() {
  const handleTrack = (e) => {
    e.preventDefault();
    alert("আপনার অর্ডার ট্র্যাকিং রিকুয়েস্ট গ্রহণ করা হয়েছে।");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-20 min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">🚚 Track Your Order</h1>
        <p className="text-gray-500 text-sm mb-6">আপনার Order ID এবং Email দিয়ে অর্ডারের স্ট্যাটাস জানুন।</p>
        
        <form onSubmit={handleTrack} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Order ID</label>
            <input type="text" required placeholder="উদাহরণ: 12345" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Billing Email / Phone</label>
            <input type="text" required placeholder="আপনার ইমেইল বা ফোন নাম্বার" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
            Track Now
          </button>
        </form>
      </div>
    </div>
  );
}