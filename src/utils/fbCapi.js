import fs from 'fs';
import path from 'path';

// ডাটাবেস (JSON ফাইল) থেকে সেটিংস পড়ার ফাংশন
function getPixelSettings() {
    try {
        const dataFilePath = path.join(process.cwd(), 'data', 'pixel-settings.json');
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            return JSON.parse(fileData);
        }
    } catch (error) {
        console.error("Error reading CAPI settings:", error);
    }
    return null;
}

// ফেসবুকে ইভেন্ট পাঠানোর মেইন ফাংশন
export async function sendServerEvent(eventName, eventData = {}, clientData = {}) {
    const settings = getPixelSettings();
    
    // সেটিংস, পিক্সেল আইডি বা টোকেন না থাকলে কাজ করবে না
    if (!settings || !settings.pixel_id || !settings.access_token) {
        console.log("CAPI aborted: Pixel ID or Token missing.");
        return;
    }

    const { pixel_id, access_token, test_event_code } = settings;

    // ক্লায়েন্টের আইপি ও ইউজার এজেন্ট (এটি ইভেন্ট ম্যাচিংয়ের জন্য খুব জরুরি)
    const clientIpAddress = clientData.ip || '127.0.0.1';
    const clientUserAgent = clientData.userAgent || '';
    const fbc = clientData.fbc || '';
    const fbp = clientData.fbp || '';

    // ফেসবুকের ফরম্যাট অনুযায়ী ডাটা সাজানো
    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                user_data: {
                    client_ip_address: clientIpAddress,
                    client_user_agent: clientUserAgent,
                    fbc: fbc,
                    fbp: fbp,
                    ...eventData.user_data // (যেমন: email, phone ইত্যাদি থাকলে বসবে)
                },
                custom_data: {
                    ...eventData.custom_data // (যেমন: value, currency, content_ids)
                }
            }
        ]
    };

    // যদি টেস্ট কোড থাকে, তবে সেটি যুক্ত করবে
    if (test_event_code) {
        payload.test_event_code = test_event_code;
    }

    try {
        // ফেসবুক গ্রাফ এপিআই-তে পোস্ট রিকোয়েস্ট পাঠানো
        const response = await fetch(`https://graph.facebook.com/v18.0/${pixel_id}/events?access_token=${access_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log(`CAPI Event [${eventName}] response:`, result);
        return result;
    } catch (error) {
        console.error(`Error sending CAPI Event [${eventName}]:`, error);
        return null;
    }
}