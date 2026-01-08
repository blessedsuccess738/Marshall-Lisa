
import React, { useState } from 'react';
import { User } from '../types';
import { editPromoImage } from '../services/geminiService';
import { Link } from 'react-router-dom';

const PromoToolPage: React.FC<{ user: User }> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image || !prompt) return;
    setProcessing(true);
    const result = await editPromoImage(image, prompt);
    setResultImage(result);
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="text-blue-600 font-bold flex items-center mb-8">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Dashboard
        </Link>
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-2">AI Marketing Tool</h1>
          <p className="text-gray-500 mb-8">Use Gemini 2.5 AI to generate or edit high-converting promo banners for your referral links.</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
                {image ? (
                  <img src={image} className="max-h-48 mx-auto rounded-lg shadow" alt="preview" />
                ) : (
                  <div className="py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="text-sm text-gray-500 mt-2">Upload a base image or selfie</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-4 text-xs" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Instructions for AI</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Add a luxury car in the background and a text that says: Join my team and earn ₦50k daily!'"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>

              <button 
                disabled={processing || !image}
                onClick={handleGenerate}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {processing ? 'AI is working...' : 'Generate Promo Banner'}
              </button>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-200">
              {resultImage ? (
                <div className="w-full text-center">
                  <h3 className="font-bold mb-4">Your AI Generated Banner</h3>
                  <img src={resultImage} className="w-full rounded-xl shadow-lg mb-4" alt="result" />
                  <a href={resultImage} download="promo-banner.png" className="text-blue-600 font-bold underline">Download & Share</a>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                   <p className="text-sm">Your AI result will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoToolPage;
