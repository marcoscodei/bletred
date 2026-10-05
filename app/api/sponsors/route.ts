import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Listar todos para o painel admin
export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(sponsors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar patrocinadores' }, { status: 500 });
  }
}

// Criar novo patrocinador
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, imageUrl, linkUrl, order } = body;

    if (!name || !imageUrl) {
      return NextResponse.json({ error: 'Nome e URL da imagem são obrigatórios' }, { status: 400 });
    }

    const newSponsor = await prisma.sponsor.create({
      data: {
        name,
        imageUrl,
        linkUrl: linkUrl || null,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json(newSponsor, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar patrocinador:', error);
    return NextResponse.json({ error: 'Erro ao criar patrocinador' }, { status: 500 });
  }
}

// Deletar patrocinador (passando ID via query param ?id=...)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    await prisma.sponsor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar patrocinador' }, { status: 500 });
  }
}