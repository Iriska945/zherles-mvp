import fs from 'fs';
import path from 'path';
import {
  DatabaseSchema,
  User,
  AuthSession,
  UserBonusTransaction,
  BonusCoupon,
  TierInfo,
  UserTier,
} from '@/types';
import seedData from '@/data/seedData.json';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

export function calculateTierInfo(points: number, visitsCount: number = 0): TierInfo {
  const safePoints = Math.max(0, points);

  if (safePoints >= 3000) {
    return {
      currentTier: 'Легенда Района',
      nextTier: undefined,
      pointsToNextTier: 0,
      progressPercentage: 100,
      discountRate: 20,
    };
  } else if (safePoints >= 1500) {
    const pointsInTier = safePoints - 1500;
    const progress = Math.min(100, Math.max(0, Math.round((pointsInTier / 1500) * 100)));
    return {
      currentTier: 'Почетный Көрші',
      nextTier: 'Легенда Района',
      pointsToNextTier: 3000 - safePoints,
      progressPercentage: progress,
      discountRate: 15,
    };
  } else if (safePoints >= 500) {
    const pointsInTier = safePoints - 500;
    const progress = Math.min(100, Math.max(0, Math.round((pointsInTier / 1000) * 100)));
    return {
      currentTier: 'Активный Көрші',
      nextTier: 'Почетный Көрші',
      pointsToNextTier: 1500 - safePoints,
      progressPercentage: progress,
      discountRate: 10,
    };
  } else {
    const progress = Math.min(100, Math.max(0, Math.round((safePoints / 500) * 100)));
    return {
      currentTier: 'Сосед-Новичок',
      nextTier: 'Активный Көрші',
      pointsToNextTier: 500 - safePoints,
      progressPercentage: progress,
      discountRate: 5,
    };
  }
}

export function getDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE_PATH)) {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const initialDb: DatabaseSchema = {
      users: [],
      sessions: [],
      bonusTransactions: [],
      coupons: (seedData.coupons || []) as BonusCoupon[],
      campaigns: (seedData.campaigns || []) as any[],
      partners: (seedData.partners || []) as any[],
      businesses: seedData.business ? [seedData.business as any] : [],
      templates: (seedData.templates || []) as any[],
      clients: (seedData.clients || []) as any[],
    };
    saveDb(initialDb);
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const data = JSON.parse(content) as DatabaseSchema;
    // Ensure all required arrays exist
    if (!data.users) data.users = [];
    if (!data.sessions) data.sessions = [];
    if (!data.bonusTransactions) data.bonusTransactions = [];
    if (!data.coupons) data.coupons = [];
    if (!data.campaigns) data.campaigns = [];
    if (!data.partners) data.partners = [];
    if (!data.businesses) data.businesses = [];
    if (!data.templates) data.templates = [];
    if (!data.clients) data.clients = [];
    return data;
  } catch (error) {
    console.error('Failed to read db.json, reinitializing fallback:', error);
    const fallbackDb: DatabaseSchema = {
      users: [],
      sessions: [],
      bonusTransactions: [],
      coupons: (seedData.coupons || []) as BonusCoupon[],
      campaigns: (seedData.campaigns || []) as any[],
      partners: (seedData.partners || []) as any[],
      businesses: seedData.business ? [seedData.business as any] : [],
      templates: (seedData.templates || []) as any[],
      clients: (seedData.clients || []) as any[],
    };
    saveDb(fallbackDb);
    return fallbackDb;
  }
}

export function resetDb(): DatabaseSchema {
  const currentDb = getDb();
  const existingUsers = currentDb.users || [];
  const existingSessions = currentDb.sessions || [];
  const existingTx = currentDb.bonusTransactions || [];

  const initialDb: DatabaseSchema = {
    users: existingUsers,
    sessions: existingSessions,
    bonusTransactions: existingTx,
    coupons: (seedData.coupons || []) as BonusCoupon[],
    campaigns: (seedData.campaigns || []) as any[],
    partners: (seedData.partners || []) as any[],
    businesses: seedData.business ? [seedData.business as any] : [],
    templates: (seedData.templates || []) as any[],
    clients: (seedData.clients || []) as any[],
  };
  saveDb(initialDb);
  return initialDb;
}

export function saveDb(data: DatabaseSchema): void {

  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tmpPath = `${DB_FILE_PATH}.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, DB_FILE_PATH);
}
