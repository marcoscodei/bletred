import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

const buildAvatar = (nick: string) =>
  `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(
    nick
  )}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false`;

// Mantém o formato que o front espera
const toClient = (c: {
  id: string;
  newsId: string;
  authorName: string;
  avatar: string | null;
  content: string;
  createdAt: Date;
}) => ({
  id: c.id,
  newsId: c.newsId,
  author: c.authorName,
  avatar: c.avatar || buildAvatar(c.authorName),
  content: c.content,
  createdAt: c.createdAt,
  likes: 0, // Controlado localmente no front-end por enquanto
});

// GET: Buscar comentários de uma notícia específica
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const comments = await prisma.newsComment.findMany({
      where: { newsId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments.map(toClient));
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return NextResponse.json({ error: 'Erro ao carregar comentários.' }, { status: 500 });
  }
}

// POST: Criar um novo comentário
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const author = String(body.author ?? body.nick ?? body.authorName ?? body.username ?? '').trim();
    const content = String(body.content ?? body.text ?? body.comment ?? '').trim();

    if (!author || !content) {
      return NextResponse.json({ error: 'Preencha o nick e o comentário.' }, { status: 400 });
    }
    if (author.length > 30) {
      return NextResponse.json({ error: 'Nick muito longo.' }, { status: 400 });
    }
    if (content.length > 500) {
      return NextResponse.json({ error: 'Comentário muito longo (máx. 500 caracteres).' }, { status: 400 });
    }

    const news = await prisma.news.findUnique({ where: { id }, select: { id: true } });
    if (!news) {
      return NextResponse.json({ error: 'Notícia não encontrada.' }, { status: 404 });
    }

    // Busca o usuário na base para pegar o avatar real atualizado, se existir
    const communityUser = await prisma.communityUser.findUnique({
      where: { username: author },
      select: { avatar: true },
    });

    const userAvatar = communityUser?.avatar || buildAvatar(author);

    // Cria o comentário e atualiza o contador da notícia em transação (removido o 'likes' que não existe no model)
    const [newComment] = await prisma.$transaction([
      prisma.newsComment.create({
        data: {
          newsId: id,
          authorName: author,
          avatar: userAvatar,
          content,
        },
      }),
      prisma.news.update({
        where: { id },
        data: { comments: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(toClient(newComment), { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar comentário:', error);
    return NextResponse.json({ error: 'Erro ao salvar comentário.' }, { status: 500 });
  }
}