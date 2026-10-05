import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '50';
    const search = searchParams.get('search') || '';

    // O servidor do Next.js faz o pedido à API externa (bypassando o CORS do browser)
    const response = await fetch(
      `https://www.habbletvendas.com.br/api/emblemas?page=${page}&pageSize=${pageSize}&search=${search}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao comunicar com a API externa' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no proxy de emblemas:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}