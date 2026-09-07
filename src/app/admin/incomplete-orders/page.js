"use client";
import { useEffect, useState } from 'react';

const CK = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "ck_02c16fdb3753d157bd7a89ddbdeb17790d59978c";
const CS = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "cs_9ea7ec03a2e976a3da5fb5ec2ce351f64dd1f16d";
const DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://admin.gadgetmartbd.shop";

export default function IncompleteOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // চেকবক্সের জন্য স্টেট

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/incomplete-orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // সব ডাটা একসাথে সিলেক্ট করা
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(orders.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  // সিঙ্গেল চেকবক্স সিলেক্ট করা
  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    }
  };

  // মার্ক করা ডাটাগুলো একসাথে ডিলিট করা
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return alert('দয়া করে ডিলিট করার জন্য অন্তত একটি ডাটা সিলেক্ট করুন!');
    if (!confirm('আপনি কি সিলেক্ট করা ডাটাগুলো চিরতরে ডিলিট করতে চান?')) return;

    try {
      const idsParam = selectedIds.join(',');
      const res = await fetch(`/api/incomplete-orders?ids=${idsParam}`, { method: 'DELETE' });
      
      if (res.ok) {
        setOrders(orders.filter(o => !selectedIds.includes(o.id)));
        setSelectedIds([]);
      } else {
        alert('ডিলিট করতে সমস্যা হয়েছে!');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  const handleConvertToOrder = async (order) => {
    if (!confirm('আপনি কি এই ইনকমপ্লিট অর্ডারটি মেইন অর্ডারে পাঠাতে চান?')) return;
    setConvertingId(order.id);
    
    try {
      const lineItems = order.cart_data.map(item => ({
        product_id: item.id || item.product_id,
        quantity: item.quantity || 1
      }));

      const orderData = {
        payment_method: "cod",
        payment_method_title: "Cash on delivery",
        set_paid: false,
        billing: {
          first_name: order.name,
          address_1: order.address,
          phone: order.phone
        },
        line_items: lineItems,
        shipping_lines: [{
          method_id: "flat_rate",
          method_title: "Delivery charge",
          total: "120"
        }]
      };

      const wcRes = await fetch(`${DOMAIN}/wp-json/wc/v3/orders?consumer_key=${CK}&consumer_secret=${CS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (wcRes.ok) {
        await fetch(`/api/incomplete-orders?session_id=${order.session_id}`, { method: 'DELETE' });
        setOrders(orders.filter(o => o.id !== order.id));
        alert('অর্ডারটি সফলভাবে পাঠানো হয়েছে এবং এখান থেকে মুছে ফেলা হয়েছে!');
      } else {
        alert('অর্ডার তৈরি করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
      }
    } catch (error) {
      console.error("Convert error:", error);
      alert('নেটওয়ার্ক এরর!');
    } finally {
      setConvertingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600 font-semibold">লোড হচ্ছে...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Incomplete Orders Tracker</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left w-12">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={orders.length > 0 && selectedIds.length === orders.length}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer" 
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact / Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cart Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => {
                const cartData = order.cart_data || [];
                
                let waPhone = order.phone.replace(/[^0-9]/g, '');
                if (waPhone.length === 11 && waPhone.startsWith('01')) {
                  waPhone = '88' + waPhone;
                }

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(order.id)}
                        onChange={(e) => handleSelectOne(e, order.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer" 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 mb-3 font-medium">{order.phone}</div>
                      <div className="flex flex-wrap gap-2">
                        <a href={`tel:${order.phone}`} className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition">Call</a>
                        <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="bg-green-100 text-green-600 px-3 py-1 rounded text-xs font-semibold hover:bg-green-200 transition">WhatsApp</a>
                        <button 
                          onClick={() => handleConvertToOrder(order)} 
                          disabled={convertingId === order.id}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                        >
                          {convertingId === order.id ? 'Sending...' : 'Create Order'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* নতুন প্রোডাক্ট ইমেজ এবং ডিটেইলস সেকশন */}
                      <div className="space-y-3">
                        {cartData.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-10 h-10 relative flex-shrink-0 border rounded overflow-hidden bg-gray-50">
                              {item.image ? (
                                <img src={item.image} alt="Product" className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold text-gray-800 line-clamp-1" dangerouslySetInnerHTML={{ __html: item.name }} />
                              <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                                Qty: {item.quantity || 1} &nbsp;|&nbsp; ৳{item.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">কোনো ইনকমপ্লিট অর্ডার পাওয়া যায়নি।</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* নতুন Bulk Delete বাটন */}
        {orders.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">
              {selectedIds.length} টি অর্ডার সিলেক্ট করা হয়েছে
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className={`px-4 py-2 rounded text-sm font-bold text-white transition ${
                selectedIds.length > 0 
                  ? 'bg-red-600 hover:bg-red-700 cursor-pointer shadow-sm' 
                  : 'bg-red-300 cursor-not-allowed'
              }`}
            >
              ডিলিট করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}