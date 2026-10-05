import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Listar eventos
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}

// Criar evento
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, dateText, linkUrl } = body;

    if (!title || !imageUrl || !dateText) {
      return NextResponse.json({ error: 'Título, imagem e data são obrigatórios' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        dateText,
        linkUrl: linkUrl || null,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
}

// Deletar evento
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar evento' }, { status: 500 });
  }
}