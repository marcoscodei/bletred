import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Remove o cookie de autenticação (ajusta 'token' se o teu cookie tiver outro nome, ex: 'session')
    cookieStore.delete('token');

    return NextResponse.json(
      { message: 'Logout efetuado com sucesso' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' }, 
      { status: 500 }
    );
  }
}