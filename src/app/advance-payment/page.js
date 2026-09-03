'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function PaymentNoticeContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone'); 
  
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (phone) {
      fetch('/api/courier-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          setHistoryData(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [phone]);

  const couriers = ['pathao', 'steadfast', 'redx', 'paperfly', 'carrybee', 'courierfast', 'parceldex'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-sans">
      
      {/* ১. নতুন ডিজাইনের নোটিশ সেকশন */}
      <div className="mb-8">
        {/* হেডার / ব্যাজ */}
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#0b1043] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl">
            !
          </div>
          <div className="bg-[#0b1043] text-white px-5 py-2 rounded-full font-bold text-lg">
            অ্যাডভান্স পেমেন্ট নোটিশ
          </div>
        </div>

        {/* মেইন নোটিশ বক্স */}
        <div className="bg-[#0b1043] rounded-xl p-6 shadow-md">
          <div className="text-white text-lg md:text-xl font-medium leading-[1.8]">
            আমাদের সিস্টেমের স্বয়ংক্রিয় কুরিয়ার হিস্টোরি চেক অনুযায়ী আপনার ডেলিভারি সাকসেস রেট ৭০%-এর নিচে রয়েছে। তাই অর্ডারটি কনফার্ম করতে অনুগ্রহ করে ৫০ টাকা অ্যাডভান্স পেমেন্ট সম্পন্ন করুন। পেমেন্ট সম্পন্ন হলে একদম নিচে গিয়ে সেখান থেকে অর্ডার করবেন।
          </div>
        </div>
      </div>

      {/* ২. অডিও প্লেয়ার (অটো-প্লে যুক্ত করা হয়েছে) */}
      <div className="mb-6">
        <audio autoPlay controls preload="auto" className="w-full h-12 rounded-lg bg-gray-100">
          <source src="/fraud-notice-audio.mp3" type="audio/mpeg" />
        </audio>
      </div>

      {/* ৩. পেমেন্ট অপশনগুলো */}
      <div className="space-y-3 mb-8">
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <span className="font-bold text-pink-600 text-base">বিকাশ:</span>
          <div>
            <p className="font-bold text-gray-900 text-base">01892369049</p>
            <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded font-semibold inline-block mt-1">এটা বিকাশ মার্চেন্ট নাম্বার। পেমেন্ট করতে হবে।</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <span className="font-bold text-orange-600 text-base">নগদ:</span>
          <div>
            <p className="font-bold text-gray-900 text-base">01771261818</p>
            <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded font-semibold inline-block mt-1">এটা পারসোনাল নাম্বার। সেন্ড মানি করবেন।</span>
          </div>
        </div>
      </div>

      {/* ৪. কুরিয়ার হিস্ট্রি */}
      {phone && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">আপনার কুরিয়ার ডেলিভারি হিস্ট্রি</h3>
          
          {loading ? (
            <div className="text-teal-600 font-bold animate-pulse text-sm">ডেটা লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।</div>
          ) : historyData ? (
            <div>
              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm border border-gray-200 text-gray-900 shadow-inner">
                <strong className="text-gray-900">মোট পার্সেল:</strong> {historyData.summary?.total_parcel} | <strong className="text-green-600">সাকসেস:</strong> {historyData.summary?.success_parcel} | <strong className="text-red-600">ক্যানসেল:</strong> {historyData.summary?.cancelled_parcel} | <strong className="text-gray-900">সাকসেস রেট:</strong> {historyData.summary?.success_ratio}%
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse border border-gray-300">
                  <thead className="bg-gray-200 text-gray-900">
                    <tr>
                      <th className="border border-gray-300 p-2 font-bold">কুরিয়ার</th>
                      <th className="border border-gray-300 p-2 text-center font-bold">মোট</th>
                      <th className="border border-gray-300 p-2 text-center font-bold text-green-700">সাকসেস</th>
                      <th className="border border-gray-300 p-2 text-center font-bold text-red-700">ক্যানসেল</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {couriers.map(c => historyData[c] && (
                      <tr key={c} className="bg-white hover:bg-gray-50">
                        <td className="border border-gray-300 p-2 font-semibold capitalize text-gray-900">{historyData[c].name}</td>
                        <td className="border border-gray-300 p-2 text-center font-medium text-gray-900">{historyData[c].total_parcel}</td>
                        <td className="border border-gray-300 p-2 text-center font-bold text-green-600">{historyData[c].success_parcel}</td>
                        <td className="border border-gray-300 p-2 text-center font-bold text-red-600">{historyData[c].cancelled_parcel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {historyData.reports && historyData.reports.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
                  <strong className="text-red-800">⚠️ ফ্রড রিপোর্ট পাওয়া গেছে:</strong><br/>
                  {historyData.reports.map((rep, idx) => (
                    <div key={idx} className="text-red-700 mt-1">- {rep.details} ({rep.courierName})</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600 font-semibold text-sm">হিস্ট্রি পাওয়া যায়নি।</div>
          )}
        </div>
      )}

      {/* ৫. কনফার্মেশন বাটন */}
      <div className="mt-4">
        <a href="/custom-checkout" className="block w-full bg-teal-700 text-white font-bold py-4 rounded-xl hover:bg-teal-800 transition-colors shadow-md text-xl text-center cursor-pointer">
          পেমেন্ট করেছি, এখন অর্ডার প্লেস করব ➔
        </a>
      </div>
      
    </div>
  );
}

export default function AdvancePaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">লোড হচ্ছে...</div>}>
      <PaymentNoticeContent />
    </Suspense>
  );
}