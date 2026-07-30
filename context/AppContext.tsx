'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, BonusCoupon, Business, Campaign, CampaignTemplate } from '@/types';
import {
  addCampaign as addCampaignStorage,
  addTemplate as addTemplateStorage,
  deleteTemplate as deleteTemplateStorage,
  updateTemplate as updateTemplateStorage,
  getInitialState,
  redeemBonus as redeemBonusStorage,
  resetDemoState as resetDemoStorage,
  STATE_CHANGE_EVENT,
  updateBusinessProfile as updateBusinessStorage,
} from '@/lib/storage';

interface AppContextType {
  state: AppState;
  resetDemo: () => void;
  redeemBonus: (pinCode: string) => {
    success: boolean;
    coupon?: BonusCoupon;
    error?: string;
    redeemedAt?: string;
  };
  addCampaign: (campaign: Campaign) => void;
  updateBusiness: (business: Business) => void;
  addTemplate: (template: CampaignTemplate) => void;
  deleteTemplate: (id: string) => void;
  updateTemplate: (template: CampaignTemplate) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    // Sync state on load
    setState(getInitialState());

    // Listen to custom intra-tab events
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AppState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(getInitialState());
      }
    };

    // Listen to window storage events (cross-tab sync)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'zherles_app_state_v1') {
        setState(getInitialState());
      }
    };

    window.addEventListener(STATE_CHANGE_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(STATE_CHANGE_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const resetDemo = () => {
    const freshState = resetDemoStorage();
    setState(freshState);
  };

  const redeemBonus = (pinCode: string) => {
    return redeemBonusStorage(pinCode);
  };

  const addCampaign = (campaign: Campaign) => {
    const updated = addCampaignStorage(campaign);
    setState(updated);
  };

  const updateBusiness = (business: Business) => {
    const updated = updateBusinessStorage(business);
    setState(updated);
  };

  const addTemplate = (template: CampaignTemplate) => {
    const updated = addTemplateStorage(template);
    setState(updated);
  };

  const deleteTemplate = (id: string) => {
    const updated = deleteTemplateStorage(id);
    setState(updated);
  };

  const updateTemplate = (template: CampaignTemplate) => {
    const updated = updateTemplateStorage(template);
    setState(updated);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        resetDemo,
        redeemBonus,
        addCampaign,
        updateBusiness,
        addTemplate,
        deleteTemplate,
        updateTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
