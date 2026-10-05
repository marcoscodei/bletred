import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const NICK_REGEX = /^[a-zA-Z0-9\-=?!@:.,]{1,15}$/;

const getAvatarUrl = (nick: string) =>
  `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(
    nick
  )}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false`;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
    }

    const cleanUsername = String(username).trim();

    if (!NICK_REGEX.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Nick inválido. Use apenas letras sem acento, números e - = ? ! @ : . , (máx. 15 caracteres).' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.communityUser.findUnique({
      where: { username: cleanUsername },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este nick já está em uso na comunidade!' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = getAvatarUrl(cleanUsername);

    const newUser = await prisma.communityUser.create({
      data: {
        username: cleanUsername,
        name: cleanUsername,
        password: hashedPassword,
        avatar,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, username: newUser.username, avatar },
    });
  } catch (err: any) {
    console.error('Erro no registro da comunidade:', err);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}