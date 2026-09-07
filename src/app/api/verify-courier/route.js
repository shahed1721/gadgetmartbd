import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const phone = body.phone;

    // ১. ফোন নম্বর যাচাই
    if (!phone || phone.length < 11) {
      return NextResponse.json({ success: false, message: 'সঠিক ১১ ডিজিটের ফোন নম্বর দিন।' }, { status: 400 });
    }

    // ২. API Key ও সেটিংস
    const apiKey = 'otrYxExG2sfoBSzsBJx7u1avGck0sy4kjpTSOb69x2FjlBS41uP7fyIvJqIo'; 
    const minSuccess = 50; 

    // ৩. BD Courier API তে রিকুয়েস্ট পাঠানো
    const response = await fetch('https://api.bdcourier.com/courier-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ phone: phone }),
    });

    const result = await response.json();
    
    // টার্মিনালে ডাটা দেখার জন্য লগ (Testing purpose)
    console.log("Courier API Response:", result);

    if (result && result.status === 'success') {
      const summary = result.data.summary;
      const reports = result.data.reports || [];
      
      const totalParcel = parseInt(summary.total_parcel || 0, 10);
      const successRatio = parseFloat(summary.success_ratio || 0);

      // লজিক ১: নতুন কাস্টমার
      if (totalParcel === 0) {
        return NextResponse.json({
          success: true,
          redirectUrl: '/new-customer-notice?phone=' + encodeURIComponent(phone)
        });
      }

      // লজিক ২: ফ্রড বা লো-রেট কাস্টমার
      if (reports.length > 0 || successRatio < minSuccess) {
        return NextResponse.json({
          success: true,
          redirectUrl: '/advance-payment?phone=' + encodeURIComponent(phone)
        });
      }
    }

    // লজিক ৩: ভালো কাস্টমার (কোনো ব্লক নেই)
    return NextResponse.json({ success: true, redirectUrl: '' });

  } catch (error) {
    console.error('API Error:', error);
    // কোনো নেটওয়ার্ক সমস্যা হলে অর্ডার প্লেস করতে দেবে
    return NextResponse.json({ success: true, redirectUrl: '' }); 
  }
}