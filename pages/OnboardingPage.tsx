
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MembershipTier } from '../types';
import { PACKAGES } from '../constants';

interface OnboardingPageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [processing, setProcessing] = useState(false);

  const tiers = [MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR];

  const handleUpgrade = (tier: MembershipTier) => {
    setSelectedTier(tier);
  };

  const handlePayment = () => {
    if (!selectedTier) return;
    setProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
      const pkg = PACKAGES[selectedTier];
      const updatedUser: User = {
        ...user,
        tier: selectedTier,
        balance: user.balance + pkg.bonus,
        isActive: true
      };
      onUpdateUser(updatedUser);
      setProcessing(false);
      navigate('/dashboard');
    }, 2000);
  };

  if (selectedTier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
          <p className="text-gray-500 mb-6">Upgrade to <strong>{PACKAGES[selectedTier].name}</strong></p>
          <div className="bg-gray-100 p-6 rounded-2xl mb-8">
            <div className="flex justify-between mb-2">
              <span>Plan Price</span>
              <span className="font-bold">₦{PACKAGES[selectedTier].price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Instant Bonus</span>
              <span className="font-bold">+₦{PACKAGES[selectedTier].bonus.toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            disabled={processing}
            onClick={handlePayment}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {processing ? 'Processing Payment...' : 'Pay with Flutterwave'}
          </button>
          <button onClick={() => setSelectedTier(null)} className="mt-4 text-sm text-gray-500">Back to Plans</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Final Step: Select Your Earning Plan</h1>
          <p className="text-gray-500">You must select a plan to activate your dashboard and start earning.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map(tier => (
            <div key={tier} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{PACKAGES[tier].name}</h3>
              <div className="text-3xl font-black text-blue-600 mb-6">₦{PACKAGES[tier].price.toLocaleString()}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {PACKAGES[tier].benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleUpgrade(tier)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
              >
                Choose {PACKAGES[tier].name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
