'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function NewCustomerNoticeContent() {
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
          {`আপনার এই নম্বর দিয়ে পূর্বে অনলাইন বা ই-কমার্স সাইটে কোনো অর্ডার করার ইতিহাস পাওয়া যায়নি। আমাদের সিস্টেমে এটি আপনার প্রথম অর্ডার হওয়ায়, অর্ডারটি কনফার্ম করতে অনুগ্রহ করে ২০ টাকা অ্যাডভান্স (বিকাশ/নগদ) পেমেন্ট সম্পন্ন করুন। বাকি টাকা পণ্য হাতে পেয়ে ক্যাশ অন ডেলিভারিতে (COD) দিতে পারবেন।\n\nপেমেন্ট সম্পন্ন হলে একদম নিচে গিয়ে সেখান থেকে অর্ডার করবেন।`}
        </div>

        {/* অডিও প্লেয়ার (অটো-প্লে যুক্ত করা হয়েছে) */}
        <div className="mb-6">
          <audio autoPlay controls preload="auto" className="w-full h-10 rounded-lg">
            <source src="/new-customer-audio.mp3" type="audio/mpeg" />
          </audio>
        </div>

        {/* পেমেন্ট অপশনগুলো */}
        <div className="space-y-3 mb-6">
          <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center gap-3 shadow-xs">
            <span className="text-2xl">📱</span>
            <div className="flex-1">
              <span className="font-bold text-[#e11d48] text-sm">বিকাশ: 01892369049</span>
              <div>
                <span className="text-[11px] bg-[#fff5f5] text-[#e53e3e] border border-dashed border-[#feb2b2] px-1.5 py-0.5 rounded font-semibold inline-block mt-1">
                  এটা বিকাশ মার্চেন্ট নাম্বার। বিকাশ অ্যাপ এর মধ্য গিয়ে পেমেন্ট অপশন থেকে টাকা পাঠাতে হবে।
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center gap-3 shadow-xs">
            <span className="text-2xl">📱</span>
            <div className="flex-1">
              <span className="font-bold text-[#e11d48] text-sm">নগদ: 01771261818</span>
              <div>
                <span className="text-[11px] bg-[#fff5f5] text-[#e53e3e] border border-dashed border-[#feb2b2] px-1.5 py-0.5 rounded font-semibold inline-block mt-1">
                  এটা পার্সোনাল নাম্বার। এটা তো সেন্ড মানি করবেন না।
                </span>
              </div>
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
              <div className="bg-gray-50 p-4 rounded-lg text-center border">
                <span className="text-3xl mb-2 block">📦</span>
                <p className="text-gray-800 font-bold">মোট অর্ডার হিস্ট্রি: {historyData.summary?.total_parcel || 0}</p>
                <p className="text-xs text-gray-500 mt-1">আপনার এই নাম্বার দিয়ে পূর্বে কোনো অর্ডারের রেকর্ড পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="text-red-500 text-sm">হিস্ট্রি পাওয়া যায়নি।</div>
            )}
          </div>
        )}

        {/* কনফার্মেশন বাটন */}
        <div className="mt-6 text-center border-t border-orange-200 pt-6">
          <a href="/custom-checkout" className="block w-full bg-teal-700 text-white font-bold py-3.5 rounded-lg hover:bg-teal-800 transition-colors shadow-md text-lg text-center cursor-pointer">
            পেমেন্ট করেছি, এখন অর্ডার প্লেস করব ➔
          </a>
        </div>
      </div>
    </div>
  );
}

export default function NewCustomerNoticePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">লোড হচ্ছে...</div>}>
      <NewCustomerNoticeContent />
    </Suspense>
  );
}