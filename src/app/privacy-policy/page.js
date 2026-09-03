import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Gadget Mart BD',
  description: 'গ্যাজেট মার্ট বিডি-এর প্রাইভেসি পলিসি',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">প্রাইভেসি পলিসি (Privacy Policy)</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">১. আমরা কী ধরনের তথ্য সংগ্রহ করি?</h2>
            <p>আমাদের ওয়েবসাইট থেকে অর্ডার করার সময় আমরা আপনার কিছু ব্যক্তিগত তথ্য সংগ্রহ করি। এর মধ্যে রয়েছে আপনার নাম, মোবাইল নাম্বার, ডেলিভারি ঠিকানা (Address) এবং ইমেইল অ্যাড্রেস। একটি সফল ডেলিভারি নিশ্চিত করতে এই তথ্যগুলো অত্যন্ত জরুরি।</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">২. তথ্যের ব্যবহার</h2>
            <p>আপনার দেওয়া তথ্যগুলো আমরা মূলত নিচের কাজগুলোতে ব্যবহার করে থাকি:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>অর্ডার প্রসেস এবং কুরিয়ারের মাধ্যমে আপনার ঠিকানায় প্রোডাক্ট ডেলিভারি করার জন্য।</li>
              <li>অর্ডারের আপডেট বা কোনো সমস্যা হলে আপনার সাথে যোগাযোগ করার জন্য।</li>
              <li>ভবিষ্যতে আমাদের নতুন প্রোডাক্ট বা অফারের আপডেট জানানোর জন্য (আপনার সম্মতি সাপেক্ষে)।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">৩. তথ্য সুরক্ষা ও নিরাপত্তা</h2>
            <p>আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে সর্বোচ্চ অগ্রাধিকার। আপনার নাম, নাম্বার বা ঠিকানা সম্পূর্ণ সুরক্ষিত সার্ভারে সংরক্ষণ করা হয় এবং আমরা কোনো থার্ড-পার্টি কোম্পানি বা বিজ্ঞাপনী সংস্থার কাছে আমাদের কাস্টমারদের ডেটা বিক্রি বা শেয়ার করি না।</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-teal-700 mb-2">৪. কুরিয়ার সার্ভিসের সাথে তথ্য শেয়ার</h2>
            <p>আপনার অর্ডার করা গ্যাজেটটি আপনার ঠিকানায় পৌঁছে দেওয়ার জন্য আমাদেরকে বাধ্য হয়েই আপনার নাম, ঠিকানা ও মোবাইল নাম্বার আমাদের ডেলিভারি পার্টনার (যেমন: পাঠাও, রেডেক্স, স্টিডফাস্ট ইত্যাদি কুরিয়ার সার্ভিস)-এর সাথে শেয়ার করতে হয়। এটি শুধুমাত্র ডেলিভারি কাজ সম্পন্ন করার স্বার্থেই করা হয়।</p>
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