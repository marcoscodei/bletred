// app/api/emblemas/route.ts
// Proxy server-side para a API real do Habblet Vendas (evita problemas de CORS no navegador).
import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM = 'https://api.habbletvendas.com.br/emblemas';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || 30));
  const search = (searchParams.get('search') || '').trim();

  const url = new URL(UPSTREAM);
  url.searchParams.set('page', String(page));
  url.searchParams.set('pageSize', String(pageSize));
  if (search) {
    // Nome do parâmetro de busca: confirme na aba Network do site original (veja a observação na resposta).
    url.searchParams.set('search', search);
  }

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: `API retornou ${res.status}` }, { status: 502 });
    }
    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: 'Falha ao conectar na API de emblemas' }, { status: 502 });
  }
}