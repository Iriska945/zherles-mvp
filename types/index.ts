export interface Business {
  id: string;
  name: string;
  category: string;
  district: string;
  avgCheck: number;
  phone: string;
  contactName: string;
  description: string;
  logoUrl: string;
  coordinates?: { lat: number; lng: number };
  address?: string;
  activePromotions?: string[];
}

export interface Partner {
  id: string;
  businessId: string;
  name: string;
  category: string;
  district: string;
  matchScore: number;
  avgCheck: number;
  status: 'ACTIVE' | 'PENDING' | 'SUGGESTED';
  coordinates?: { lat: number; lng: number };
  address?: string;
  activePromotions?: string[];
}

export interface BusinessPassportModalData {
  id: string;
  name: string;
  category: string;
  district: string;
  address?: string;
  avgCheck: number;
  phone?: string;
  contactName?: string;
  matchScore?: number;
  description?: string;
  logoUrl?: string;
  coordinates?: { lat: number; lng: number };
  activePromotions?: string[];
  isPrimary?: boolean;
}

export interface CampaignTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  recommendedFor: string;
  defaultReward: string;
  expectedReach: string;
  expectedRoi: string;
  tags: string[];
}

export interface Campaign {
  id: string;
  title: string;
  sourceBusinessId: string;
  targetPartnerIds: string[];
  rewardText: string;
  minSpend: number;
  durationDays: number;
  expireDate: string;
  qrCodeUrl: string;
  shareMessage: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED' | 'EXPIRED';
  createdAt: string;
}

export interface ClientCRM {
  id: string;
  name: string;
  phone: string;
  acquiredFromPartner: string;
  campaignId: string;
  totalSpent: number;
  visitCount: number;
  status: 'NEW' | 'ACTIVE' | 'VIP' | 'CHURNED';
  lastVisit: string;
}

export interface BonusCoupon {
  id: string;
  campaignId: string;
  pinCode: string;
  rewardText: string;
  partnerName: string;
  customerPhone: string;
  status: 'ACTIVE' | 'REDEEMED';
  redeemedAt?: string;
  redeemedByStaff?: string;
}

export interface DistrictPassportDeal {
  id: string;
  title: string;
  businessName: string;
  category: string;
  reward: string;
  pinCode: string;
  qrCodeUrl: string;
  minSpend: number;
}

export interface GlobalUserProfile {
  globalPoints: number;
  visitsCount: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  globalDiscount: number;
  holidayBonuses: number;
}

export interface GreenApiSettings {
  idInstance: string;
  apiTokenInstance: string;
}

export interface AppState {
  business: Business;
  partners: Partner[];
  templates: CampaignTemplate[];
  campaigns: Campaign[];
  clients: ClientCRM[];
  coupons: BonusCoupon[];
  districtPassport: {
    districtName: string;
    featuredDeals: DistrictPassportDeal[];
  };
  userProfile: GlobalUserProfile;
  greenApiSettings: GreenApiSettings;
}

// --- B2C Auth & Real DB Models ---

export type UserTier = 'Сосед-Новичок' | 'Активный Көрші' | 'Почетный Көрші' | 'Легенда Района';

export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  passwordHash: string;
  tier: UserTier;
  bonusBalance: number;
  discountRate: number;
  visitsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface UserBonusTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'REDEEMED' | 'WELCOME' | 'HOLIDAY' | 'PROMO';
  amount: number;
  description: string;
  createdAt: string;
  relatedCouponId?: string;
}

export interface TierInfo {
  currentTier: UserTier;
  nextTier?: UserTier;
  pointsToNextTier: number;
  progressPercentage: number;
  discountRate: number;
}

export interface UserCabinetData {
  user: Omit<User, 'passwordHash'>;
  tierInfo: TierInfo;
  bonusBalance: number;
  activeCoupons: BonusCoupon[];
  recentTransactions: UserBonusTransaction[];
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'passwordHash'>;
  token?: string;
  tierInfo?: TierInfo;
  error?: string;
}

export interface DatabaseSchema {
  users: User[];
  sessions: AuthSession[];
  bonusTransactions: UserBonusTransaction[];
  coupons: BonusCoupon[];
  campaigns: Campaign[];
  partners: Partner[];
  businesses: Business[];
  templates: CampaignTemplate[];
  clients: ClientCRM[];
}

