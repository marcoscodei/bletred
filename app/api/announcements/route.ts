import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Apenas busca os avisos reais, sem recriar dados falsos se estiver vazio
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar avisos" }, { status: 500 });
  }
}