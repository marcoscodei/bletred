import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const emblems = await prisma.emblem.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(emblems);
  } catch (error) {
    console.error('Erro ao buscar emblemas:', error);
    return NextResponse.json([], { status: 500 });
  }
}