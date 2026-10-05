import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET: /api/news (todas) ou /api/news?onlyNews=true (só as da seção Novidades)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyNews = searchParams.get('onlyNews') === 'true';

    const news = await prisma.news.findMany({
      where: onlyNews ? { isNews: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar novidades:', error);
    return NextResponse.json({ error: 'Erro ao buscar novidades' }, { status: 500 });
  }
}

// POST: Criar nova publicação
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('bletred_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Não autorizado. Faça login.' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
    }

    const authorName = session.username;
    const authorAvatar = `https://www.habblet.city/habbo-imaging/avatarimage?user=${encodeURIComponent(authorName)}&action=std&direction=2&head_direction=2&gesture=sml&size=m`;

    const body = await request.json();
    const { title, category, content, imageUrl, isNews } = body;

    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    const newArticle = await prisma.news.create({
      data: {
        title,
        category,
        content,
        imageUrl: typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl.trim() : null, // <--- estava faltando
        authorName,
        authorAvatar,
        isNews: Boolean(isNews),
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar novidade:', error);
    return NextResponse.json({ error: 'Erro ao criar novidade' }, { status: 500 });
  }
}

// DELETE: Apagar notícia
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 });
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao apagar novidade:', error);
    return NextResponse.json({ error: 'Erro ao apagar novidade' }, { status: 500 });
  }
}