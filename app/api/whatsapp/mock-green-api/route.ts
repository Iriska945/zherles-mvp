import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    idMessage: 'mock-wa-msg-99999',
    chatId: body.chatId,
    message: body.message,
  });
}
