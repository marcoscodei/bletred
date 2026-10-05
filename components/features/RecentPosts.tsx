'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl?: string | null; // Corrigido para bater certo com o Prisma e o Painel Admin
  authorName: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

const AVATAR_BASE = 'https://api.habbletvendas.com.br/avatar';
const AVATAR_PARAMS = 'head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false';

const getAvatarUrl = (nick: string) => `${AVATAR_BASE}?nick=${encodeURIComponent(nick)}&${AVATAR_PARAMS}`;

// Gera um resumo em texto puro a partir de conteúdo que pode conter HTML
// (inclusive HTML "escapado", como &lt;div&gt;). A ordem importa:
// 1) decodifica entidades de tags, 2) remove as tags, 3) decodifica o resto.
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
};

function AvatarImg({ srcs, alt }: { srcs: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const key = srcs.join('|');

  useEffect(() => {
    setIdx(0);
  }, [key]);

  if (idx >= srcs.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
        <Users size={14} />
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

// Sub-componente seguro para gerir a exibição da capa/banner ou o fallback de ícone
function PostBanner({ imageUrl, title, category }: { imageUrl?: string | null; title: string; category: string }) {
  const [hasError, setHasError] = useState(false);

  if (!imageUrl || imageUrl.trim() === '' || hasError) {
    return (
      <div className="flex flex-col items-center gap-1 text-white/50 w-full h-full justify-center bg-gradient-to-br from-violet-600 via-violet-700 to-blue-900">
        <Newspaper size={20} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{category || 'Notícia'}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
}

export const RecentPosts = () => {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?onlyNews=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar posts recentes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">🗂 Posts recentes</h3>
        <Link href="/news" className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">
          Ver todos &gt;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[160px]">
        {loading ? (
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-violet-100 rounded-2xl p-4 h-48 animate-pulse bg-gray-50" />
          ))
        ) : posts.length === 0 ? (
          <div className="col-span-full bg-white border border-violet-100 rounded-2xl p-8 text-center text-xs text-gray-400 shadow-sm">
            Nenhum post recente encontrado.
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.id}`}
              className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-violet-500 transition-colors cursor-pointer"
            >
              {/* Capa / Banner do Post */}
              <div className="h-32 w-full bg-slate-900 overflow-hidden relative flex items-center justify-center">
                <PostBanner imageUrl={post.imageUrl} title={post.title} category={post.category} />

                {/* Tag de Categoria Flutuante (caso tenha imagem real) */}
                {post.category && post.imageUrl && post.imageUrl.trim() !== '' && (
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-violet-100 shrink-0">
                        <AvatarImg srcs={[getAvatarUrl(post.authorName), post.authorAvatar].filter(Boolean) as string[]} alt={post.authorName} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block leading-tight">{post.authorName}</span>
                        <span className="text-[9px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-violet-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-normal line-clamp-2">{stripHtml(post.content)}</p>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-violet-50 text-[10px] text-gray-400 font-medium">
                  <span className="hover:text-violet-400 transition-colors">❤️ {post.likes ?? 0}</span>
                  <span className="hover:text-gray-600 transition-colors">💬 {post.comments ?? 0}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};