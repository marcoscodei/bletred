import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET: Listar itens da galeria
export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { order: 'asc' }, // Ou por createdAt se preferires
    });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar galeria:', error);
    return NextResponse.json({ error: 'Erro ao buscar galeria' }, { status: 500 });
  }
}

// POST: Adicionar novo item à galeria
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('bletred_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Não autorizado. Faça login.' }, { status: 401 });
    }

    const body = await request.json();
    const { label, style, imageUrl, order } = body;

    if (!label) {
      return NextResponse.json({ error: 'O rótulo (label) é obrigatório.' }, { status: 400 });
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        label,
        style: style || '',
        imageUrl: imageUrl || null,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar item na galeria:', error);
    return NextResponse.json({ error: 'Erro ao criar item na galeria' }, { status: 500 });
  }
}

// DELETE: Apagar item da galeria
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 });
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao apagar item da galeria:', error);
    return NextResponse.json({ error: 'Erro ao apagar item' }, { status: 500 });
  }
}