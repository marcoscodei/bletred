import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Aguarda a resolução dos params (obrigatório nas versões recentes do Next.js)
    const { id } = await params;

    await prisma.communityUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    // P2025 = registo não encontrado
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });
    }
    console.error('Erro ao deletar usuário:', error);
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 });
  }
}