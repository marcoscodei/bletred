const DEFAULT_COLOR = '#ff8000';

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Só aceita cores hex (#rgb ou #rrggbb); qualquer outra coisa cai no padrão
const safeColor = (c?: string) =>
  c && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c) ? c : DEFAULT_COLOR;

// Estilo do texto corrido (mantém quebras de linha e linhas em branco)
const TEXT_STYLE =
  'color: #334155; line-height: 1.6; margin-bottom: 12px; font-size: 13px; white-space: pre-line; word-break: break-word;';

function renderBlock(tag: string, attrs: string, inner: string): string {
  const text = inner.trim();
  const color = safeColor(attrs.match(/cor=(#[0-9a-fA-F]{3,6})/)?.[1]);

  switch (tag) {
    case 'div-grande':
      return `<div style="background-color: ${color}; color: #ffffff; text-align: center; font-weight: 700; border-radius: 9999px; padding: 12px 24px; margin: 20px 0; font-size: 14px; box-shadow: 0 2px 0 rgba(0,0,0,0.18);">${text}</div>`;
    case 'div-pequena':
      return `<div style="background-color: ${color}; color: #ffffff; font-weight: 700; border-top-right-radius: 16px; padding: 6px 18px 6px 14px; margin: 16px 0; display: inline-block; font-size: 14px; box-shadow: 0 2px 0 rgba(0,0,0,0.18);">${text}</div>`;
    case 'paragrafo':
      return `<div style="${TEXT_STYLE}">${text}</div>`;
    case 'imagem':
      // só aceita links http(s)
      if (!/^https?:\/\//i.test(text)) return '';
      return `<div style="text-align: center; margin: 16px 0;"><img src="${text}" alt="" style="max-width: 100%; border-radius: 12px; display: inline-block; object-fit: cover;" /></div>`;
    default:
      return '';
  }
}

// Converte shortcodes + texto solto em HTML seguro (todo texto digitado é escapado)
export function compileShortcodesToHtml(raw: string): string {
  const text = escapeHtml(raw);
  const re =
    /\[(div-grande|div-pequena|paragrafo|imagem)((?:\s+cor=#[0-9a-fA-F]{3,6})?)\]([\s\S]*?)\[\/\1\]/g;

  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    // texto solto antes do shortcode
    const loose = text.slice(last, m.index).trim();
    if (loose) out += `<div style="${TEXT_STYLE}">${loose}</div>`;

    out += renderBlock(m[1], m[2] || '', m[3]);
    last = m.index + m[0].length;
  }

  // texto solto depois do último shortcode
  const tail = text.slice(last).trim();
  if (tail) out += `<div style="${TEXT_STYLE}">${tail}</div>`;

  return out;
}

// Usar na EXIBIÇÃO:
// - se o conteúdo salvo já é HTML compilado, devolve como está;
// - se é texto puro ou shortcodes crus, converte na hora.
export function renderNewsContent(content: string): string {
  const looksLikeHtml = /<\/?[a-z][^>]*>/i.test(content);
  return looksLikeHtml ? content : compileShortcodesToHtml(content);
}

// Tira as tags para mostrar um resumo em texto (usado na Home)
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}