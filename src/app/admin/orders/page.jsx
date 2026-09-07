"use client";
import { useEffect, useState } from 'react';

// WooCommerce-এর ডাইনামিক API Keys
const CK = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "ck_02c16fdb3753d157bd7a89ddbdeb17790d59978c";
const CS = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "cs_9ea7ec03a2e976a3da5fb5ec2ce351f64dd1f16d";
const DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://admin.gadgetmartbd.shop";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // পেজ লোড হলেই অর্ডারগুলো আনবে
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // WooCommerce থেকে রিয়েল অর্ডারগুলো ফেচ করা হচ্ছে (সর্বশেষ ৫০টি অর্ডার)
      const res = await fetch(`${DOMAIN}/wp-json/wc/v3/orders?consumer_key=${CK}&consumer_secret=${CS}&per_page=50`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // স্ট্যাটাস অনুযায়ী ব্যাজের রং ঠিক করা
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600 font-semibold">অর্ডার লোড হচ্ছে...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Main Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status & Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => {
                // হোয়াটসঅ্যাপ নাম্বার ফরমেট করা
                let waPhone = order.billing.phone ? order.billing.phone.replace(/[^0-9]/g, '') : '';
                if (waPhone.length === 11 && waPhone.startsWith('01')) {
                  waPhone = '88' + waPhone;
                }

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-lg text-teal-700">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{order.billing.first_name} {order.billing.last_name}</div>
                      <div className="text-sm text-gray-900 font-medium my-1">{order.billing.phone}</div>
                      <div className="text-xs text-gray-500 mb-2">{order.billing.address_1}</div>
                      
                      {/* কল এবং হোয়াটসঅ্যাপ বাটন */}
                      {order.billing.phone && (
                        <div className="flex gap-2 mt-2">
                          <a href={`tel:${order.billing.phone}`} className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition">Call</a>
                          <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="bg-green-100 text-green-600 px-3 py-1 rounded text-xs font-semibold hover:bg-green-200 transition">WhatsApp</a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-2">
                        {order.line_items.map((item, idx) => (
                          <div key={idx} className="flex flex-col border-b border-gray-100 pb-1 last:border-0">
                            <span className="font-semibold text-gray-800 line-clamp-1">{item.name}</span>
                            <span className="text-xs text-gray-500">Qty: {item.quantity} &nbsp;|&nbsp; ৳{item.total}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">৳ {order.total}</div>
                      <div className="text-xs text-gray-500 uppercase mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">{order.payment_method_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-md border ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <div className="text-xs text-gray-500 mt-2 font-medium">
                        {new Date(order.date_created).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">কোনো অর্ডার পাওয়া যায়নি।</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}