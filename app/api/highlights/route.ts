import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Evita cache da rota GET
export const dynamic = 'force-dynamic';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET: Lista todos os destaques ordenados pelos mais recentes
export async function GET() {
  try {
    const highlights = await prisma.highlight.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(highlights, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar highlights:', error);
    return NextResponse.json({ error: 'Erro ao buscar destaques' }, { status: 500 });
  }
}

// POST: Cria um novo destaque
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, iconName, imageUrl, link } = body;

    if (!title || !subtitle || !iconName) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    const newHighlight = await prisma.highlight.create({
      data: {
        title,
        subtitle,
        iconName,
        imageUrl: imageUrl?.trim() ? imageUrl.trim() : null, // <--- estava faltando
        link: link?.trim() ? link.trim() : null,
      },
    });

    return NextResponse.json(newHighlight, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar highlight:', error);
    return NextResponse.json({ error: 'Erro ao criar destaque' }, { status: 500 });
  }
}

// DELETE: Apaga um destaque pelo ID
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 });
    }

    await prisma.highlight.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao apagar highlight:', error);
    return NextResponse.json({ error: 'Erro ao apagar destaque' }, { status: 500 });
  }
}