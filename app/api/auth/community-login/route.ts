import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const getAvatarUrl = (nick: string) =>
  `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(
    nick
  )}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false`;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Preencha o nick e a senha.' }, { status: 400 });
    }

    const cleanUsername = String(username).trim();

    const user = await prisma.communityUser.findUnique({
      where: { username: cleanUsername },
    });

    if (!user) {
      return NextResponse.json({ error: 'Nick ou senha incorretos.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Nick ou senha incorretos.' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      avatar: getAvatarUrl(user.username),
    });
  } catch (error) {
    console.error('Erro no login da comunidade:', error);
    return NextResponse.json({ error: 'Erro interno ao realizar login.' }, { status: 500 });
  }
}