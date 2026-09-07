import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | Gadget Mart BD',
  description: 'গ্যাজেট মার্ট বিডি-এর শর্তাবলী এবং রিটার্ন পলিসি',
};

export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">শর্তাবলী ও রিটার্ন পলিসি (Terms & Conditions)</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">১. সাধারণ শর্তাবলী</h2>
            <p>Gadget Mart BD-তে আপনাকে স্বাগতম! আমাদের ওয়েবসাইট থেকে কোনো প্রোডাক্ট (যেমন: পাওয়ার ব্যাংক, হেডফোন, ব্লুটুথ হেডফোন, চার্জার, মিনি ফ্যান, চার্জার লাইট ইত্যাদি) অর্ডার করার মাধ্যমে আপনি আমাদের উল্লেখিত শর্তাবলীতে সম্মতি জ্ঞাপন করছেন।</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">২. প্রোডাক্ট ডেলিভারি</h2>
            <p>আমরা কাস্টমারদের কাছে সম্পূর্ণ নতুন এবং 'ক্লোজ বক্স' (Closed Box) বা ইনট্যাক্ট প্রোডাক্ট পাঠিয়ে থাকি। ডেলিভারি পাওয়ার পর প্রোডাক্ট আনবক্স করার সময় একটি ক্লিয়ার ভিডিও ধারণ করার অনুরোধ করা হচ্ছে, যা যেকোনো অনাকাঙ্ক্ষিত সমস্যার ক্ষেত্রে প্রমাণ হিসেবে কাজ করবে।</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">৩. রিপ্লেসমেন্ট এবং ওয়ারেন্টি পলিসি</h2>
            <p className="mb-3">আমাদের নির্দিষ্ট কিছু প্রোডাক্টে ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি এবং ৬ মাসের ওয়ারেন্টি সুবিধা রয়েছে (যা প্রোডাক্টের ডেসক্রিপশনে উল্লেখ থাকে)। প্রোডাক্টে কোনো ম্যানুফ্যাকচারিং ত্রুটি (কোম্পানির দিক থেকে সমস্যা) থাকলে ৭ দিনের মধ্যে আমাদের কাছে ফেরত পাঠাতে পারবেন।</p>
            <p className="font-semibold text-red-600 mb-2">ওয়ারেন্টি/গ্যারান্টি পেতে হলে অবশ্যই নিচের শর্তগুলো মেনে চলতে হবে:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>প্যাকেজিং বা বক্স অক্ষত রাখা:</strong> প্রোডাক্টের বক্স বা প্যাকেটটি অত্যন্ত যত্ন সহকারে রাখতে হবে। বক্স কোনোভাবেই ছেঁড়া, ফাটা বা ড্যামেজ করা যাবে না। বক্সটি হারিয়ে ফেললে বা নষ্ট করে ফেললে ওয়ারেন্টি বা গ্যারান্টি কোনোভাবেই প্রযোজ্য হবে না।</li>
              <li><strong>প্রোডাক্টের বাহ্যিক অবস্থা:</strong> প্রোডাক্টের কোনো ফিজিক্যাল ড্যামেজ (Physical Damage) বা স্ক্র্যাচ থাকা যাবে না। প্রোডাক্টটি অবশ্যই নতুনের মতো ভালো কন্ডিশনে থাকতে হবে।</li>
              <li><strong>ওয়ারেন্টি বাতিলের কারণ:</strong> হাত থেকে পড়ে গিয়ে ভেঙে গেলে, আঘাত জনিত কারণে ক্ষতি হলে, পুড়ে গেলে অথবা পানিতে পড়ে নষ্ট হলে সেগুলোর উপর কোনো ওয়ারেন্টি বা গ্যারান্টি প্রযোজ্য হবে না।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">৪. অর্ডার বাতিল বা পরিবর্তন</h2>
            <p>স্টক শেষ হয়ে যাওয়া বা অন্য কোনো অনিবার্য কারণে Gadget Mart BD যেকোনো সময় কোনো অর্ডার বাতিল বা মডিফাই করার অধিকার রাখে। অর্ডার কনফার্ম হওয়ার আগে কাস্টমারের সাথে ফোনে যোগাযোগ করে বিস্তারিত জানিয়ে দেওয়া হবে।</p>
          </section>

          <div className="pt-6 mt-8 border-t">
            <Link href="/" className="text-teal-600 hover:text-teal-800 font-semibold inline-flex items-center gap-2 transition-colors">
              <span>←</span> হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}