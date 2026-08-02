import { NextResponse } from 'next/server';
import { resetDb } from '@/lib/db';

export async function POST() {
  try {
    resetDb();
    return NextResponse.json({ success: true, message: 'Database reset successfully' });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
