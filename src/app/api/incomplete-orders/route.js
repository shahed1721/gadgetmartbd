import { NextResponse } from 'next/server';

let memoryOrders = [];

export async function GET() {
  return NextResponse.json(memoryOrders);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, name, phone, address, cart_data } = body;

    if (!phone && !name) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const existingIndex = memoryOrders.findIndex(o => o.session_id === session_id);

    const orderData = {
      id: existingIndex !== -1 ? memoryOrders[existingIndex].id : Date.now(),
      session_id,
      name: name || '',
      phone: phone || '',
      address: address || '',
      cart_data: cart_data || [],
      created_at: existingIndex !== -1 ? memoryOrders[existingIndex].created_at : new Date().toISOString()
    };

    if (existingIndex !== -1) {
      memoryOrders[existingIndex] = orderData;
    } else {
      memoryOrders.unshift(orderData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// আপডেট: সিঙ্গেল সেশন এবং মার্ক করা একসাথে একাধিক ডাটা ডিলিটের লজিক
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id');
    const ids_param = searchParams.get('ids');

    if (session_id) {
      memoryOrders = memoryOrders.filter(o => o.session_id !== session_id);
    } else if (ids_param) {
      const idsArray = ids_param.split(',').map(Number);
      memoryOrders = memoryOrders.filter(o => !idsArray.includes(o.id));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}