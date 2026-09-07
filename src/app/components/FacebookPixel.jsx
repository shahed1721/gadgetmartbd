"use client";
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacebookPixel() {
  const pathname = usePathname();
  const [pixelData, setPixelData] = useState({ pixel_id: '', test_event_code: '' });

  // API থেকে সেভ করা পিক্সেল আইডি এবং টেস্ট ইভেন্ট কোড নিয়ে আসা
  useEffect(() => {
    fetch('/api/pixel-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.pixel_id) {
          setPixelData({
            pixel_id: data.pixel_id,
            test_event_code: data.test_event_code || ''
          });
        }
      })
      .catch((err) => console.error("Error fetching pixel settings:", err));
  }, []);

  // রাউট বা পেজ পরিবর্তন হলে নতুন করে PageView ফায়ার করা (টেস্ট কোড সহ)
  useEffect(() => {
    if (pixelData.pixel_id && typeof window !== 'undefined' && window.fbq) {
      if (pixelData.test_event_code) {
        window.fbq('set', 'test_event_code', pixelData.test_event_code);
      }
      window.fbq('track', 'PageView');
    }
  }, [pathname, pixelData]);

  // পিক্সেল আইডি না থাকলে কোড রান করবে না
  if (!pixelData.pixel_id) return null;

  return (
    <Script
      id="facebook-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelData.pixel_id}');
          ${pixelData.test_event_code ? `fbq('set', 'test_event_code', '${pixelData.test_event_code}');` : ''}
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}