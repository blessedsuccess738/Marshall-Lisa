
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MembershipTier } from '../types';
import { ADMIN_EMAIL } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL) {
      // Fix: Added missing referralBalance and transactions properties to satisfy User interface
      const adminUser: User = {
        id: 'admin-1',
        fullName: 'Super Admin',
        username: 'admin',
        email: ADMIN_EMAIL,
        phone: '0000000000',
        country: 'System',
        tier: MembershipTier.EMPEROR,
        balance: 9999999,
        referralBalance: 0,
        referrals: [],
        isActive: true,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        transactions: []
      };
      onLogin(adminUser);
      navigate('/admin');
      return;
    }

    // Mock Login for existing users
    // Fix: Added missing referralBalance and transactions properties to satisfy User interface
    const mockUser: User = {
      id: 'user-123',
      fullName: 'John Doe',
      username: 'johndoe',
      email: email,
      phone: '1234567890',
      country: 'Nigeria',
      tier: MembershipTier.KING,
      balance: 5400,
      referralBalance: 0,
      referrals: ['ref1', 'ref2'],
      isActive: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      transactions: []
    };
    onLogin(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-[10px] text-gray-400 mt-1">Tip: Use {ADMIN_EMAIL} for Admin Panel access</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
