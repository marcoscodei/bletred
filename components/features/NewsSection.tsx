'use client';

import React, { useEffect, useState } from 'react';

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

// API do Habblet Vendas (só a cabeça)
const AVATAR_BASE = 'https://api.habbletvendas.com.br/avatar';
const AVATAR_PARAMS =
  'head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false';

const FALLBACK_AVATAR = `${AVATAR_BASE}?nick=BletRed&${AVATAR_PARAMS}`;

const getAvatarUrl = (nick: string) =>
  `${AVATAR_BASE}?nick=${encodeURIComponent(nick)}&${AVATAR_PARAMS}`;

// Troca para o avatar padrão se a imagem falhar (sem entrar em loop)
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_AVATAR) {
    img.src = FALLBACK_AVATAR;
  }
};

// Capa/banner com fallback
function NewsBanner({ imageUrl, category }: { imageUrl?: string | null; category: string }) {
  const [hasError, setHasError] = useState(false);

  if (!imageUrl || imageUrl.trim() === '' || hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-violet-700 via-indigo-900 to-slate-950 relative overflow-hidden flex items-center justify-center">
        <span className="absolute top-3 left-3 bg-violet-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white z-10">
          {category}
        </span>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-blue-500/30 blur-3xl"></div>
        <h2 className="relative text-3xl font-black italic text-white -rotate-1">
          Blet<span className="text-violet-400">Red</span>
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900 flex items-center justify-center group">
      <img
        src={imageUrl}
        alt="Capa da novidade"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <span className="absolute top-3 left-3 bg-violet-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white z-10 shadow-md">
        {category}
      </span>
    </div>
  );
}

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?onlyNews=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data.filter((item: NewsItem) => item.isNews === true));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar novidades:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900">📰 Novidades</h3>
        </div>
        <div className="bg-white border border-violet-100 rounded-2xl p-4 h-64 animate-pulse bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">📰 Novidades</h3>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">
          Ver todos &gt;
        </span>
      </div>

      {news.length === 0 && (
        <div className="bg-white border border-violet-100 rounded-2xl p-6 text-center text-xs text-gray-400 shadow-sm">
          Nenhuma novidade no momento.
        </div>
      )}

      {news.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-violet-100 rounded-2xl p-4 space-y-4 shadow-sm"
        >
          {/* Capa / Banner */}
          <div className="h-40 rounded-xl overflow-hidden relative">
            <NewsBanner imageUrl={item.imageUrl} category={item.category} />
          </div>

          <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>

          <div className="flex items-center justify-between pt-3 border-t border-violet-50 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-violet-600 overflow-hidden shrink-0">
                <img
                  src={getAvatarUrl(item.authorName)}
                  alt={item.authorName}
                  className="w-full h-full object-cover scale-125"
                  onError={handleImgError}
                />
              </div>
              por {item.authorName} · {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="flex gap-4 font-medium">
              <span>❤️ {item.likes}</span>
              <span>💬 {item.comments}</span>
              <span>🔁 {item.shares}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};