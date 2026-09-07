"use client";
import { useState, useEffect } from 'react';

export default function PixelSettingsPage() {
  const [pixelData, setPixelData] = useState({
    pixel_id: '',
    access_token: '',
    test_event_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // পেজ লোড হলে API থেকে সেভ করা ডাটা নিয়ে আসবে
  useEffect(() => {
    fetch('/api/pixel-settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setPixelData(data);
        }
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // সেভ বাটনে ক্লিক করলে ডাটা API তে পাঠাবে
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/pixel-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pixelData)
      });
      
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      setMessage('Error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Facebook Pixel & CAPI Settings</h2>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg font-semibold ${message.includes('success') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Pixel ID</label>
            <input 
              type="text" 
              value={pixelData.pixel_id} 
              onChange={(e) => setPixelData({...pixelData, pixel_id: e.target.value})} 
              placeholder="e.g. 123456789012345" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Conversion API Access Token</label>
            <textarea 
              value={pixelData.access_token} 
              onChange={(e) => setPixelData({...pixelData, access_token: e.target.value})} 
              placeholder="EAAI..." 
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-32 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Test Event Code (Optional)</label>
            <input 
              type="text" 
              value={pixelData.test_event_code} 
              onChange={(e) => setPixelData({...pixelData, test_event_code: e.target.value})} 
              placeholder="e.g. TEST12345" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 mt-4"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}