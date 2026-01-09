
import { MembershipTier, Package } from './types';

export const ADMIN_EMAIL = 'blessedsuccess738@gmail.com';
export const NGN_TO_USD = 1600;

export const PACKAGES: Record<MembershipTier, Package> = {
  [MembershipTier.NONE]: {
    id: MembershipTier.NONE,
    name: 'Inactive',
    price: 0,
    bonus: 0,
    dailyRate: 0,
    videoRate: 0,
    songRate: 0,
    songLimit: 0,
    videoLimit: 0,
    benefits: ['No Access']
  },
  [MembershipTier.PINCK]: {
    id: MembershipTier.PINCK,
    name: 'Pinck (Free)',
    price: 0,
    bonus: 0,
    dailyRate: 0,
    videoRate: 0,
    songRate: 0,
    songLimit: 0,
    videoLimit: 0,
    benefits: ['View Only', 'Upgrade to Earn']
  },
  [MembershipTier.LEGACY]: {
    id: MembershipTier.LEGACY,
    name: 'Legacy',
    price: 5000,
    bonus: 500,
    dailyRate: 200,
    videoRate: 50,
    songRate: 50,
    songLimit: 5,
    videoLimit: 5,
    benefits: ['5 Songs Daily', '5 Videos Daily', 'Mining Active', '₦500 Bonus']
  },
  [MembershipTier.KING]: {
    id: MembershipTier.KING,
    name: 'King',
    price: 15000,
    bonus: 1500,
    dailyRate: 750,
    videoRate: 100,
    songRate: 100,
    songLimit: 12,
    videoLimit: 12,
    benefits: ['12 Songs Daily', '12 Videos Daily', 'Enhanced Mining', '₦1,500 Bonus']
  },
  [MembershipTier.EMPEROR]: {
    id: MembershipTier.EMPEROR,
    name: 'Emperor',
    price: 50000,
    bonus: 5000,
    dailyRate: 3000,
    videoRate: 250,
    songRate: 250,
    songLimit: 30,
    videoLimit: 30,
    benefits: ['30 Songs Daily', '30 Videos Daily', 'Max Mining', '₦5,000 Bonus']
  }
};

export const REFERRAL_RATES = [0.10, 0.05, 0.02];
