import Header from './components/Header'; 
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import MobileBottomNav from './components/MobileBottomNav'; // <-- নতুন বটম নেভিগেশন যুক্ত করা হলো
import FacebookPixel from './components/FacebookPixel'; // <-- ফেসবুক পিক্সেল যুক্ত করা হলো
import './globals.css';

export const metadata = {
  title: 'Gadget Mart BD',
  description: 'Smart lifestyle choices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        
        {/* ফেসবুক পিক্সেল কম্পোনেন্ট (এটি ব্যাকগ্রাউন্ডে কাজ করবে) */}
        <FacebookPixel />

        <CartProvider>
          {/* হেডার */}
          <Header />
          
          {/* মূল পেজের কন্টেন্ট (মোবাইলে বটম মেনুর জন্য নিচে একটু জায়গা pb-16 রাখা হলো) */}
          <main className="flex-grow pb-16 md:pb-0">
            {children}
          </main>
          
          {/* ফুটার */}
          <Footer />

          {/* মোবাইল বটম নেভিগেশন বার */}
          <MobileBottomNav />
          
        </CartProvider>
      </body>
    </html>
  );
}