
import React from 'react';
import { Link } from 'react-router-dom';
import { PACKAGES } from '../constants';
import { MembershipTier } from '../types';

const LandingPage: React.FC = () => {
  const tiers = [MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full glass z-50 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-blue-600 flex items-center">
          <span className="bg-blue-600 text-white p-1 rounded-md mr-2">EL</span>
          EarnLink
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600 transition">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
          Turn Your Digital Activity Into <span className="text-blue-600">Daily Income</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Join 50,000+ members earning passive rewards by watching videos, daily mining, and inviting friends.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/register" className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform w-full sm:w-auto">
            Get Started Now
          </Link>
          <div className="flex -space-x-3 overflow-hidden p-2">
            {[1, 2, 3, 4].map(i => (
              <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={`https://picsum.photos/100/100?random=${i}`} alt="user" />
            ))}
            <div className="flex items-center ml-4 text-sm font-medium text-gray-500">
              50k+ Active Earners
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Choose Your Growth Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map(tier => (
              <div key={tier} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
                {tier === MembershipTier.EMPEROR && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-widest">
                    Best Value
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{PACKAGES[tier].name}</h3>
                <div className="text-4xl font-black text-gray-900 mb-6">₦{PACKAGES[tier].price.toLocaleString()}</div>
                <ul className="space-y-4 mb-8 flex-1">
                  {PACKAGES[tier].benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="w-full py-4 rounded-xl font-bold text-center bg-gray-900 text-white hover:bg-black transition">
                  Select {PACKAGES[tier].name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 font-bold text-2xl">1</div>
            <h4 className="text-xl font-bold mb-2">Choose Plan</h4>
            <p className="text-gray-500">Pick the membership tier that fits your daily earning goals.</p>
          </div>
          <div>
            <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 font-bold text-2xl">2</div>
            <h4 className="text-xl font-bold mb-2">Complete Tasks</h4>
            <p className="text-gray-500">Daily mining and video tasks take less than 10 minutes a day.</p>
          </div>
          <div>
            <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 font-bold text-2xl">3</div>
            <h4 className="text-xl font-bold mb-2">Withdraw</h4>
            <p className="text-gray-500">Instantly withdraw your earnings to your bank or crypto wallet.</p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-12">₦500M+ Already Paid Out</h2>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale invert">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Paystack_Logo.png" alt="Paystack" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Flutterwave_Logo.png" alt="Flutterwave" className="h-8" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
