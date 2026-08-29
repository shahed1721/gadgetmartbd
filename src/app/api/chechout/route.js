import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const orderData = await request.json();

    const ck = "ck_e8bee42940cb29849845a1b7b1f2b057caac6db0";
    const cs = "cs_5e3dc7597b9f4bb0f4539b63e0d83b561ba644cc";
    const domain = "https://gadgetmartbd.shop";

    const response = await fetch(`${domain}/wp-json/wc/v3/orders?consumer_key=${ck}&consumer_secret=${cs}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.message || "WordPress API error" }, { status: response.status });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}