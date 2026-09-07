'use client';
import { useCart } from './CartContext';

export default function Addtocartbtn({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // যাতে ক্লিক করলে অন্য পেজে চলে না যায়
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.src || '/logo.png',
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      type="button"
      className="w-full bg-[#ff0000] hover:bg-red-700 text-white text-xs md:text-sm font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition uppercase tracking-wider shadow-sm cursor-pointer"
    >
      🛒 ADD TO CART
    </button>
  );
}