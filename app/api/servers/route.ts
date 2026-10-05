import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const servers = await prisma.server.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(servers);
  } catch (error) {
    console.error('Erro ao buscar servidores:', error);
    return NextResponse.json([], { status: 500 });
  }
}