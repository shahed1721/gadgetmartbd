import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ডাটা সেভ করার জন্য ফাইলের পাথ সেট করা (প্রজেক্টের রুট ডিরেক্টরিতে data/pixel-settings.json)
const dataFilePath = path.join(process.cwd(), 'data', 'pixel-settings.json');

export async function GET() {
    try {
        // ফাইল না থাকলে ডিফল্ট খালি ডাটা পাঠাবে
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ 
                pixel_id: '', 
                access_token: '', 
                test_event_code: '' 
            });
        }
        
        // ফাইল থেকে ডাটা পড়ে ফ্রন্টএন্ডে পাঠাবে
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        const settings = JSON.parse(fileData);
        
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error reading pixel settings:", error);
        return NextResponse.json({ error: 'Error reading settings' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        
        const settings = {
            pixel_id: data.pixel_id || '',
            access_token: data.access_token || '',
            test_event_code: data.test_event_code || ''
        };
        
        // data ফোল্ডারটি না থাকলে সেটি তৈরি করে নেওয়া
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // ডাটাগুলো JSON ফাইলে সেভ করা
        fs.writeFileSync(dataFilePath, JSON.stringify(settings, null, 2));
        
        return NextResponse.json({ message: 'Settings saved successfully', data: settings }, { status: 200 });
    } catch (error) {
        console.error("Error saving pixel settings:", error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}