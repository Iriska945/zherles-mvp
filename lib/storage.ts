import { AppState, BonusCoupon, Campaign, CampaignTemplate, Business } from '@/types';
import seedData from '@/data/seedData.json';

const STORAGE_KEY = 'zherles_app_state_v1';
export const STATE_CHANGE_EVENT = 'zherles_state_change';

export function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return seedData as AppState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData as AppState;
    }
    return JSON.parse(raw) as AppState;
  } catch (error) {
    console.error('Failed to parse state from localStorage, resetting to seed:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData as AppState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT, { detail: state }));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function resetDemoState(): AppState {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT, { detail: seedData }));
    } catch (error) {
      console.error('Failed to reset demo state:', error);
    }
  }
  return seedData as AppState;
}

export function redeemBonus(pinCode: string): {
  success: boolean;
  coupon?: BonusCoupon;
  error?: string;
  redeemedAt?: string;
} {
  const state = getInitialState();
  const couponIndex = state.coupons.findIndex((c) => c.pinCode === pinCode);

  if (couponIndex === -1) {
    return { success: false, error: 'Код бонуса не найден' };
  }

  const coupon = state.coupons[couponIndex];

  if (coupon.status === 'REDEEMED') {
    return {
      success: false,
      error: 'Бонус уже был использован',
      redeemedAt: coupon.redeemedAt,
    };
  }

  const redeemedAt = new Date().toISOString();
  const updatedCoupon: BonusCoupon = {
    ...coupon,
    status: 'REDEEMED',
    redeemedAt,
    redeemedByStaff: 'Кассир (Автоматически)',
  };

  const updatedCoupons = [...state.coupons];
  updatedCoupons[couponIndex] = updatedCoupon;

  // Global Points Logic
  let updatedUserProfile = { ...state.userProfile };
  if (updatedUserProfile) {
    updatedUserProfile.globalPoints += 500; // e.g. 500 points per redeem
    updatedUserProfile.visitsCount += 1;
    
    if (updatedUserProfile.visitsCount >= 10) {
      updatedUserProfile.tier = 'Gold';
      updatedUserProfile.globalDiscount = 15;
    } else if (updatedUserProfile.visitsCount >= 5) {
      updatedUserProfile.tier = 'Silver';
      updatedUserProfile.globalDiscount = 10;
    } else {
      updatedUserProfile.tier = 'Bronze';
      updatedUserProfile.globalDiscount = 5;
    }
  }

  const newState: AppState = {
    ...state,
    coupons: updatedCoupons,
    userProfile: updatedUserProfile || state.userProfile,
  };

  saveState(newState);

  return {
    success: true,
    coupon: updatedCoupon,
    redeemedAt,
  };
}

export function addCampaign(campaign: Campaign): AppState {
  const currentState = getInitialState();
  const existingPins = new Set(currentState.coupons.map((c) => c.pinCode));
  
  let uniquePin = Math.floor(1000 + Math.random() * 9000).toString();
  let attempts = 0;
  while (existingPins.has(uniquePin) && attempts < 100) {
    uniquePin = Math.floor(1000 + Math.random() * 9000).toString();
    attempts++;
  }

  const newCoupon: BonusCoupon = {
    id: `coup-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    campaignId: campaign.id,
    pinCode: uniquePin,
    rewardText: campaign.rewardText,
    partnerName: currentState.business.name,
    customerPhone: '+7 (777) 000-0000',
    status: 'ACTIVE',
  };

  const updatedState: AppState = {
    ...currentState,
    campaigns: [campaign, ...currentState.campaigns],
    coupons: [newCoupon, ...currentState.coupons],
  };
  saveState(updatedState);
  return updatedState;
}

export function updateBusinessProfile(business: Business): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    business,
  };
  saveState(updatedState);
  return updatedState;
}

export function addTemplate(template: CampaignTemplate): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    templates: [template, ...currentState.templates],
  };
  saveState(updatedState);
  return updatedState;
}

export function deleteTemplate(id: string): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    templates: currentState.templates.filter((t) => t.id !== id),
  };
  saveState(updatedState);
  return updatedState;
}

export function updateTemplate(template: CampaignTemplate): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    templates: currentState.templates.map((t) => (t.id === template.id ? template : t)),
  };
  saveState(updatedState);
  return updatedState;
}

export function updateGreenApiSettings(idInstance: string, apiTokenInstance: string): AppState {
  const currentState = getInitialState();
  const updatedState: AppState = {
    ...currentState,
    greenApiSettings: {
      idInstance,
      apiTokenInstance
    }
  };
  saveState(updatedState);
  return updatedState;
}

