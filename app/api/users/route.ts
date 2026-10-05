import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const validRoles = [
  'DESENVOLVEDOR',
  'WEBMASTER',
  'DIRETOR',
  'ADMINISTRADOR',
  'COORDENADOR',
  'JORNALISTA',
  'PROMOTOR',
  'LOCUTOR',
];

// Letras sem acento, números e símbolos aceitos em nicks do Habbo (máx. 15)
const NICK_REGEX = /^[a-zA-Z0-9\-=?!@:.,]{1,15}$/;

// API do Habblet Vendas (só a cabeça)
const getAvatarUrl = (nick: string) =>
  `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(nick)}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false`;

const publicFields = {
  id: true,
  username: true,
  name: true,
  avatar: true,
  role: true,
  createdAt: true,
} as const;

// GET: Listar todos os utilizadores
export async function GET() {
  try {
    const users = await prisma.communityUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: publicFields,
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar utilizadores:', error);
    return NextResponse.json({ error: 'Erro ao buscar utilizadores' }, { status: 500 });
  }
}

// POST: Criar novo utilizador
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    const cleanUsername = String(username).trim();

    if (!NICK_REGEX.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Nick inválido. Use apenas letras sem acento, números e - = ? ! @ : . , (máx. 15 caracteres).' },
        { status: 400 }
      );
    }

    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Cargo inválido selecionado.' }, { status: 400 });
    }

    // Verificar se o utilizador já existe
    const existingUser = await prisma.communityUser.findUnique({
      where: { username: cleanUsername },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Este nick já está registado.' }, { status: 400 });
    }

    // Gerar URL do avatar automaticamente com base no nick
    const avatarUrl = getAvatarUrl(cleanUsername);

    const newUser = await prisma.communityUser.create({
      data: {
        username: cleanUsername,
        // TODO: guardar com hash (bcrypt) e ajustar o login para bcrypt.compare
        password,
        name: cleanUsername,
        avatar: avatarUrl,
        role,
      },
      // Nunca devolver a senha na resposta
      select: publicFields,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    return NextResponse.json({ error: 'Erro ao criar utilizador' }, { status: 500 });
  }
}

// DELETE: Apagar utilizador
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 });
    }

    const userToDelete = await prisma.communityUser.findUnique({ where: { id } });

    if (!userToDelete) {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });
    }

    if (userToDelete.username === 'admin') {
      return NextResponse.json({ error: 'Não é permitido apagar o administrador principal.' }, { status: 400 });
    }

    await prisma.communityUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao apagar utilizador:', error);
    return NextResponse.json({ error: 'Erro ao apagar utilizador' }, { status: 500 });
  }
}