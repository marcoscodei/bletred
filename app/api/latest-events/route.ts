import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const formattedEvents = events.map((ev) => {
      const parts = ev.dateText.trim().split(' ');
      const day = parts[0] || '01';
      const month = parts[1] || 'EVENTO';

      return {
        id: ev.id,
        title: ev.title,
        desc: ev.description || ev.dateText,
        imageUrl: ev.imageUrl, // <--- Enviando a imagem corretamente
        day: day,
        month: month.toUpperCase(),
        linkUrl: ev.linkUrl || null,
      };
    });

    return NextResponse.json(formattedEvents, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar últimos eventos:', error);
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}