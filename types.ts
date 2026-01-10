
export enum MembershipTier {
  NONE = 'NONE',
  PINCK = 'PINCK',
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
  songRate: number;
  songLimit: number;
  videoLimit: number;
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

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  reward: number;
  section: string;
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
  avatarUrl?: string;
  createdAt: string;
  transactions: Transaction[];
  miningState: {
    lastStartedAt: string | null;
    isClaimable: boolean;
  };
  dailySpinClaimed: boolean;
  dailyEarnings: {
    quiz: number;
    songs: number;
    videos: number;
    lastReset: string;
  };
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

export interface SystemSettings {
  withdrawalOpen: boolean;
  withdrawalMessage: string;
  announcement: string;
  songs: Song[];
  quizQuestions: QuizQuestion[];
}
