
export enum MembershipTier {
  NONE = 'NONE',
  LEGACY = 'LEGACY',
  KING = 'KING',
  EMPEROR = 'EMPEROR'
}

export interface Package {
  id: MembershipTier;
  name: string;
  price: number;
  bonus: number;
  dailyRate: number;
  videoRate: number;
  benefits: string[];
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
  referrals: string[]; // IDs of users referred
  referredBy?: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastMiningAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  timestamp: string;
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
