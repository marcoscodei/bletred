import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const ROLE = 'ADMIN'; // O model Admin não tem campo "role", então fica fixo aqui

const setSession = async (username: string) => {
  const cookieStore = await cookies();
  cookieStore.set('bletred_session', JSON.stringify({ username, role: ROLE }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Se forem as credenciais do admin padrão, garante que ele existe e atualiza a senha se necessário
    if (username === 'admin' && password === 'admin123') {
      const adminUser = await prisma.admin.upsert({
        where: { username: 'admin' },
        update: { password: 'admin123' },
        create: { username: 'admin', password: 'admin123' },
      });

      await setSession(adminUser.username);
      return NextResponse.json({ success: true, role: ROLE, username: adminUser.username });
    }

    // Validação para os demais admins
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    await setSession(admin.username);
    return NextResponse.json({ success: true, role: ROLE, username: admin.username });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}