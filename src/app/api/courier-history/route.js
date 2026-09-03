import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { phone } = await request.json();
    if (!phone || phone.length < 11) {
      return NextResponse.json({ success: false, message: 'Invalid phone' });
    }

    const apiKey = 'otrYxExG2sfoBSzsBJx7u1avGck0sy4kjpTSOb69x2FjlBS41uP7fyIvJqIo';
    
    const res = await fetch('https://api.bdcourier.com/courier-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ phone }),
    });
    
    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ success: false, message: 'API error' });
  }
}