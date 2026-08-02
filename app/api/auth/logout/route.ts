import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('zherles_session_token')?.value;

    if (token) {
      const db = getDb();
      db.sessions = db.sessions.filter((s) => s.token !== token);
      saveDb(db);
    }

    cookieStore.delete('zherles_session_token');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера при выходе' },
      { status: 500 }
    );
  }
}
