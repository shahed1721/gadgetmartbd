"use client";
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FacebookPixel() {
  const pathname = usePathname();
  const [pixelId, setPixelId] = useState('');

  // API থেকে সেভ করা পিক্সেল আইডি নিয়ে আসা
  useEffect(() => {
    fetch('/api/pixel-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.pixel_id) {
          setPixelId(data.pixel_id);
        }
      })
      .catch((err) => console.error("Error fetching pixel ID:", err));
  }, []);

  // রাউট বা পেজ পরিবর্তন হলে নতুন করে PageView ফায়ার করা
  useEffect(() => {
    if (pixelId && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, pixelId]);

  // পিক্সেল আইডি না থাকলে কোড রান করবে না
  if (!pixelId) return null;

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
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}