import Header from './components/Header'; 
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import './globals.css';

export const metadata = {
  title: 'Gadget Mart BD',
  description: 'Smart lifestyle choices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <CartProvider>
          {/* হেডার */}
          <Header />
          
          {/* মূল পেজের কন্টেন্ট */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* ফুটার */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}