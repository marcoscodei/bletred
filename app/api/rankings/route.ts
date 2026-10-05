import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'geral';

    const now = new Date();
    let startDate: Date | null = null;

    // Definir o filtro de data com base no separador escolhido
    if (period === 'diario') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'semanal') {
      const firstDayOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.setDate(firstDayOfWeek));
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'mensal') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Consulta agrupada por autor na tabela de comentários
    // NOTA: Se a tua tabela de comentários tiver outro nome no Prisma (ex: NewsComment), ajusta aqui.
    const whereClause = startDate ? { createdAt: { gte: startDate } } : undefined;

    const rankingData = await prisma.newsComment.groupBy({
      by: ['authorName'],
      where: whereClause,
      _count: {
        id: true, // Conta quantos comentários o utilizador fez
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10, // Top 10 utilizadores
    });

    // Matar o formato para o que o componente RankingsCard espera
    const formattedRanks = rankingData.map((item, index) => ({
      id: item.authorName,
      name: item.authorName,
      tag: 'Membro Ativo', // Podes personalizar se tiveres cargos
      points: item._count.id, // O total de comentários funciona como pontos
      position: index + 1,
    }));

    return NextResponse.json(formattedRanks, { status: 200 });
  } catch (error) {
    console.error('Erro ao calcular rankings:', error);
    // Retorna array vazio em caso de erro para não quebrar o frontend
    return NextResponse.json([], { status: 200 });
  }
}