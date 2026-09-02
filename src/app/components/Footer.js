import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-16 pb-8 border-t border-slate-800 font-sans mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* ব্র্যান্ড ও ডেসক্রিপশন */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              <span className="text-teal-500">Gadget</span> Mart BD
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              আপনার স্মার্ট লাইফস্টাইলের জন্য সেরা গ্যাজেট ও অ্যাক্সেসরিজ। প্রিমিয়াম কোয়ালিটি এবং সারা বাংলাদেশে দ্রুত কুরিয়ার ডেলিভারি নিশ্চিত করতে আমরা অঙ্গীকারবদ্ধ।
            </p>
          </div>

          {/* কুইক লিঙ্কস */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg tracking-wide border-b border-slate-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-teal-400 hover:translate-x-1 transition-all inline-block">Shop Electronics</Link></li>
              <li><Link href="/checkout" className="hover:text-teal-400 hover:translate-x-1 transition-all inline-block">Checkout</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-400 hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 hover:translate-x-1 transition-all inline-block">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* আওয়ার নেটওয়ার্ক (আপনার অন্যান্য প্রজেক্টগুলো) */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg tracking-wide border-b border-slate-700 pb-2 inline-block">Our Network</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="https://gadgetmartbd.shop" target="_blank" rel="noreferrer" className="hover:text-teal-400 hover:translate-x-1 transition-all flex items-center gap-2">🔗 Gadget Mart BD</a></li>
              <li><a href="https://genters.com.bd" target="_blank" rel="noreferrer" className="hover:text-teal-400 hover:translate-x-1 transition-all flex items-center gap-2">🔗 Genters</a></li>
              <li><a href="https://probasirsajghor.shop" target="_blank" rel="noreferrer" className="hover:text-teal-400 hover:translate-x-1 transition-all flex items-center gap-2">🔗 Probasir Sajghor</a></li>
            </ul>
          </div>

          {/* কন্টাক্ট ইনফরমেশন */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg tracking-wide border-b border-slate-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3 group">
                <span className="text-teal-500 text-xl group-hover:scale-110 transition-transform">📱</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Phone & WhatsApp</p>
                  <p className="font-semibold text-white tracking-wide">+8801516554116</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <span className="text-teal-500 text-xl group-hover:scale-110 transition-transform">📍</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-slate-300">Bogra, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* বটম বার ও ক্রেডিট */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Gadget Mart BD. All rights reserved.
          </p>
          <div className="text-slate-500 flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
            <span>Next.js & Woo-Commerce Optimized</span>
            <span className="h-4 w-px bg-slate-600 mx-1"></span>
            <span>Developed by <span className="font-bold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer tracking-wide">SHAHED</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}