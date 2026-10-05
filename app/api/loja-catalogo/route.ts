// app/api/loja-catalogo/route.ts
// Proxy server-side para a API real da loja do Habblet Vendas (evita CORS no navegador).
import { NextResponse } from 'next/server';

const UPSTREAM = 'https://www.habbletvendas.com.br/api/lojasite';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: `API retornou ${res.status}` }, { status: 502 });
    }
    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: 'Falha ao conectar na API da loja' }, { status: 502 });
  }
}