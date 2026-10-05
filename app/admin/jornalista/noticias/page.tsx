'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Newspaper, Plus, Trash2, User as UserIcon, Type, Image as ImageIcon, Layout, Eye } from 'lucide-react';
import { compileShortcodesToHtml } from '@/lib/newsContent';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl?: string | null;
  authorName: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  shares: number;
  isNews: boolean;
  createdAt: string;
}

const AVATAR_BASE = 'https://api.habbletvendas.com.br/avatar';
const AVATAR_PARAMS = 'head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false';

const getAvatarUrl = (nick: string) => `${AVATAR_BASE}?nick=${encodeURIComponent(nick)}&${AVATAR_PARAMS}`;

const COLOR_PRESETS = ['#ff8000', '#dc2626', '#2563eb', '#16a34a', '#9333ea', '#0f172a'];

function AvatarImg({ srcs, alt, iconSize = 14 }: { srcs: string[]; alt: string; iconSize?: number }) {
  const [idx, setIdx] = useState(0);
  const key = srcs.join('|');

  useEffect(() => {
    setIdx(0);
  }, [key]);

  if (idx >= srcs.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400" title={alt}>
        <UserIcon size={iconSize} />
      </div>
    );
  }

  return (
    <img
      key={srcs[idx]}
      src={srcs[idx]}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      className="w-full h-full object-cover scale-150"
      onError={() => setIdx((i) => i + 1)}
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth <= 1 || img.naturalHeight <= 1) setIdx((i) => i + 1);
      }}
    />
  );
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Geral');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [isNews, setIsNews] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tagColor, setTagColor] = useState('#ff8000'); // cor usada nas próximas divs inseridas

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pré-visualização ao vivo: recalcula sempre que o texto muda
  const previewHtml = useMemo(() => compileShortcodesToHtml(content), [content]);

  const loadNews = () => {
    fetch('/api/news', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar novidades:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadNews();
  }, []);

  const insertAtCursor = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + '\n' + snippet);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + snippet + text.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  const handleInsertBannerLarge = () => {
    const text = prompt('Texto para o Banner Grande (ex: Áreas da equipe OldHabblet):', 'Áreas da equipe');
    if (text === null) return;
    insertAtCursor(`\n[div-grande cor=${tagColor}]${text}[/div-grande]\n`);
  };

  const handleInsertBannerSmall = () => {
    const text = prompt('Texto para a Tag Pequena (ex: Construção:):', 'Construção:');
    if (text === null) return;
    insertAtCursor(`\n[div-pequena cor=${tagColor}]${text}[/div-pequena]\n`);
  };

  const handleInsertText = () => {
    const text = prompt('Escreve o texto do parágrafo:');
    if (!text) return;
    insertAtCursor(`\n[paragrafo]${text}[/paragrafo]\n`);
  };

  const handleInsertImage = () => {
    const url = prompt('Cole o link (URL) da imagem:');
    if (!url) return;
    insertAtCursor(`\n[imagem]${url}[/imagem]\n`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Escreve algum conteúdo para a publicação.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          content: previewHtml, // já compilado em HTML seguro
          imageUrl: mainImageUrl || null,
          isNews,
        }),
      });

      if (res.ok) {
        setTitle('');
        setCategory('Geral');
        setMainImageUrl('');
        setContent('');
        setIsNews(true);
        loadNews();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Erro ao publicar notícia.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que desejas apagar esta publicação?')) return;

    try {
      const res = await fetch('/api/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        loadNews();
      } else {
        alert('Erro ao apagar publicação.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-700/20">
            <Newspaper size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900">Gerenciar Publicações</h1>
            <p className="text-[11px] text-slate-500">Cria artigos estruturados utilizando tags limpas na caixa de conteúdo.</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-full">
          Total: {news.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus size={16} className="text-red-600" /> Nova Publicação
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Título da Notícia</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex: Inauguração da Rádio"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  placeholder="Ex: Eventos, Geral"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Capa Principal da Notícia (Opcional)</label>
              <input
                type="url"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="https://exemplo.com/capa.png"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            {/* Conteúdo + Botões de Atalho + Pré-visualização */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Conteúdo da Notícia
              </label>

              {/* Seletor de cor das divs */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <span className="font-semibold text-slate-600">Cor das divs:</span>
                <input
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer bg-white p-0.5"
                  title="Escolher cor"
                />
                <span className="font-mono text-[10px] text-slate-500 uppercase">{tagColor}</span>
                <div className="flex items-center gap-1.5 ml-auto">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTagColor(c)}
                      className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                        tagColor.toLowerCase() === c ? 'border-slate-900' : 'border-white shadow'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Botões de inserção rápida de tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={handleInsertText}
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 transition-colors"
                >
                  <Type size={14} className="text-red-600" /> + Parágrafo
                </button>
                <button
                  type="button"
                  onClick={handleInsertBannerLarge}
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 transition-colors"
                  title="Inserir Divisão Grande (pílula)"
                >
                  <Layout size={14} style={{ color: tagColor }} /> + Div. Grande
                </button>
                <button
                  type="button"
                  onClick={handleInsertBannerSmall}
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 transition-colors"
                  title="Inserir Tag Pequena"
                >
                  <Layout size={14} style={{ color: tagColor }} /> + Div. Pequena
                </button>
                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 transition-colors"
                >
                  <ImageIcon size={14} className="text-red-600" /> + Imagem
                </button>
              </div>

              {/* Caixa de código */}
              <textarea
                ref={textareaRef}
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Usa os botões acima para adicionar tags como [div-grande], [paragrafo], etc..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-red-600 text-slate-800 font-mono text-[11px] leading-relaxed resize-y"
              />

              {/* Pré-visualização ao vivo */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <Eye size={12} /> Pré-visualização ao vivo
                </div>
                <div
                  className="w-full min-h-[120px] max-h-[420px] bg-white border border-dashed border-slate-300 rounded-xl p-4 overflow-y-auto text-slate-800 break-words"
                  dangerouslySetInnerHTML={{
                    __html:
                      previewHtml ||
                      '<span style="color:#94a3b8">O resultado aparece aqui enquanto você escreve...</span>',
                  }}
                />
              </div>
            </div>

            {/* Checkbox Novidade */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="checkbox"
                id="isNews"
                checked={isNews}
                onChange={(e) => setIsNews(e.target.checked)}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
              />
              <label htmlFor="isNews" className="font-semibold text-slate-600 select-none cursor-pointer">
                Exibir na seção de Novidades da Home
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition-colors shadow-md shadow-red-700/20 disabled:opacity-50"
            >
              {submitting ? 'A publicar artigo...' : 'Publicar Artigo'}
            </button>
          </form>
        </div>

        {/* Lista de Publicações Existentes (Lado Direito) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 px-1">
            Publicações Realizadas
          </h3>

          {loading ? (
            <p className="text-xs text-slate-400">A carregar publicações...</p>
          ) : news.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 shadow-sm">
              Nenhuma publicação registada no momento.
            </div>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1">
              {news.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  {item.imageUrl && (
                    <div className="h-32 w-full overflow-hidden bg-slate-900 relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 bg-red-50 text-red-700 font-bold text-[10px] rounded-md uppercase">
                            {item.category}
                          </span>
                          {item.isNews && (
                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md uppercase">
                              📰 Novidade
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                        title="Apagar publicação"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full overflow-hidden border border-red-600 bg-slate-100 shrink-0">
                          <AvatarImg
                            srcs={[getAvatarUrl(item.authorName), item.authorAvatar].filter(Boolean) as string[]}
                            alt={item.authorName}
                          />
                        </span>
                        por <strong className="text-slate-700">{item.authorName}</strong>
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}