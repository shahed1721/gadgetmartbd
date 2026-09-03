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

  const noticeText = `প্রিয় গ্রাহক, আমাদের সিস্টেমের স্বয়ংক্রিয় কুরিয়ার হিস্টোরি চেক অনুযায়ী আপনার ডেলিভারি সাকসেস রেট ৭৫%-এর নিচে রয়েছে। তাই অর্ডারটি কনফার্ম করতে অনুগ্রহ করে ৫০ টাকা এডভান্স পেমেন্ট সম্পন্ন করুন।`;
  const couriers = ['pathao', 'steadfast', 'redx', 'paperfly', 'carrybee', 'courierfast', 'parceldex'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-sans">
      
      <div className="bg-[#fffbe0] border-2 border-[#f59e0b] rounded-xl p-6 shadow-sm">
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 fill-[#f59e0b] flex-shrink-0" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span className="bg-[#f59e0b] text-white text-xs font-bold px-3 py-1 rounded-full">
            গুরুত্বপূর্ণ নোটিশ
          </span>
        </div>

        {/* নোটিশ টেক্সট */}
        <div className="text-[#e11d48] text-base font-semibold leading-relaxed mb-6 whitespace-pre-line">
          {noticeText}
        </div>

        {/* অডিও প্লেয়ার */}
        <div className="mb-6">
          <audio controls preload="auto" className="w-full h-10 rounded-lg">
            <source src="/fraud-notice-audio.mp3" type="audio/mpeg" />
          </audio>
        </div>

        {/* পেমেন্ট অপশনগুলো */}
        <div className="space-y-3 mb-6">
          <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center gap-3 shadow-xs">
            <span className="font-bold text-pink-600 text-sm">বিকাশ:</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">01892369049</p>
              <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-semibold">এটা বিকাশ মার্চেন্ট নাম্বার। পেমেন্ট করতে হবে।</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center gap-3 shadow-xs">
            <span className="font-bold text-orange-600 text-sm">নগদ:</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">01771261818</p>
              <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-semibold">এটা পারসোনাল নাম্বার। সেন্ড মানি করবেন।</span>
            </div>
          </div>
        </div>

        {/* কুরিয়ার হিস্ট্রি */}
        {phone && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-2 mt-4">
            <h3 className="text-base font-bold text-gray-800 mb-3 border-b pb-2">আপনার কুরিয়ার ডেলিভারি হিস্ট্রি</h3>
            
            {loading ? (
              <div className="text-teal-600 font-bold animate-pulse text-sm">ডেটা লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।</div>
            ) : historyData ? (
              <div>
                <div className="bg-gray-50 p-2 rounded-lg mb-3 text-xs border">
                  <strong>মোট পার্সেল:</strong> {historyData.summary?.total_parcel} | <strong className="text-green-600">সাকসেস:</strong> {historyData.summary?.success_parcel} | <strong className="text-red-600">ক্যানসেল:</strong> {historyData.summary?.cancelled_parcel} | <strong>সাকসেস রেট:</strong> {historyData.summary?.success_ratio}%
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">কুরিয়ার</th>
                        <th className="border p-2 text-center">মোট</th>
                        <th className="border p-2 text-center">সাকসেস</th>
                        <th className="border p-2 text-center">ক্যানসেল</th>
                      </tr>
                    </thead>
                    <tbody>
                      {couriers.map(c => historyData[c] && (
                        <tr key={c}>
                          <td className="border p-2 font-semibold capitalize">{historyData[c].name}</td>
                          <td className="border p-2 text-center">{historyData[c].total_parcel}</td>
                          <td className="border p-2 text-center text-green-600">{historyData[c].success_parcel}</td>
                          <td className="border p-2 text-center text-red-600">{historyData[c].cancelled_parcel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {historyData.reports && historyData.reports.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                    <strong>⚠️ ফ্রড রিপোর্ট পাওয়া গেছে:</strong><br/>
                    {historyData.reports.map((rep, idx) => (
                      <div key={idx}>- {rep.details} ({rep.courierName})</div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-500 text-sm">হিস্ট্রি পাওয়া যায়নি।</div>
            )}
          </div>
        )}

        {/* কনফার্মেশন বাটন (আপডেট করা হয়েছে) */}
        <div className="mt-6 text-center border-t border-orange-200 pt-6">
          <a href="/custom-checkout" className="block w-full bg-teal-700 text-white font-bold py-3.5 rounded-lg hover:bg-teal-800 transition-colors shadow-md text-lg text-center cursor-pointer">
            পেমেন্ট করেছি, এখন অর্ডার প্লেস করব ➔
          </a>
        </div>
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