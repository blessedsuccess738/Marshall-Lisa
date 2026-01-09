
export enum MembershipTier {
  NONE = 'NONE',
  PINCK = 'PINCK', // Free starter
  LEGACY = 'LEGACY',
  KING = 'KING',
  EMPEROR = 'EMPEROR'
}

export type Currency = 'NGN' | 'USD';

export interface Package {
  id: MembershipTier;
  name: string;
  price: number;
  bonus: number;
  dailyRate: number;
  videoRate: number;
  benefits: string[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  tier: MembershipTier;
  balance: number;
  referralBalance: number;
  referrals: string[];
  referredBy?: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  transactions: Transaction[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: string;
  accountDetails: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}
