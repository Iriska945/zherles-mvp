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
}
