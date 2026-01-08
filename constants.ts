
import { MembershipTier, Package } from './types';

export const ADMIN_EMAIL = 'blessedsuccess738@gmail.com';

export const PACKAGES: Record<MembershipTier, Package> = {
  [MembershipTier.NONE]: {
    id: MembershipTier.NONE,
    name: 'Free',
    price: 0,
    bonus: 0,
    dailyRate: 0,
    videoRate: 0,
    benefits: ['Limited Access']
  },
  [MembershipTier.LEGACY]: {
    id: MembershipTier.LEGACY,
    name: 'Legacy',
    price: 5000,
    bonus: 500,
    dailyRate: 200,
    videoRate: 20,
    benefits: ['Daily Mining: ₦200', 'Video Ads: ₦20/ea', 'Instant Bonus: ₦500', '1-Level Referrals']
  },
  [MembershipTier.KING]: {
    id: MembershipTier.KING,
    name: 'King',
    price: 15000,
    bonus: 1500,
    dailyRate: 750,
    videoRate: 50,
    benefits: ['Daily Mining: ₦750', 'Video Ads: ₦50/ea', 'Instant Bonus: ₦1,500', '2-Level Referrals']
  },
  [MembershipTier.EMPEROR]: {
    id: MembershipTier.EMPEROR,
    name: 'Emperor',
    price: 50000,
    bonus: 5000,
    dailyRate: 3000,
    videoRate: 200,
    benefits: ['Daily Mining: ₦3,000', 'Video Ads: ₦200/ea', 'Instant Bonus: ₦5,000', 'Multi-Level Referrals', 'Priority Support']
  }
};

export const REFERRAL_RATES = [0.10, 0.05, 0.02]; // 10%, 5%, 2%
