'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Newspaper, ArrowLeft } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AudioPlayer } from '@/components/layout/AudioPlayer';
import { renderNewsContent } from '@/lib/newsContent';
import { CommentsSection } from '@/components/features/CommentsSection'; // Importando o novo componente de comentários

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
const AVATAR_PARAMS =
  'head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false';
const getAvatarUrl = (nick: string) =>
  `${AVATAR_BASE}?nick=${encodeURIComponent(nick)}&${AVATAR_PARAMS}`;

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch('/api/news', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((item: NewsItem) => item.id === id);
          setNews(found || null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar a notícia:', err);
        setLoading(false);
      });
  }, [id]);

  const contentHtml = useMemo(() => (news ? renderNewsContent(news.content) : ''), [news]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans pb-24">
      {/* Sidebar retrátil */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Conteúdo Principal */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 h-96 animate-pulse bg-gray-50" />
          ) : !news ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900">Notícia não encontrada</h2>
              <p className="text-xs text-gray-500">
                O artigo que procuras pode ter sido removido ou o link está incorreto.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
              >
                Voltar ao início
              </button>
            </div>
          ) : (
            <>
              <article className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                {/* Capa */}
                <div className="h-64 sm:h-96 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  {news.imageUrl ? (
                    <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/50">
                      <Newspaper size={32} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {news.category || 'Notícia'}
                      </span>
                    </div>
                  )}
                  {news.category && news.imageUrl && (
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      {news.category}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-10 space-y-6">
                  {/* Autor e métricas */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={getAvatarUrl(news.authorName)}
                          alt={news.authorName}
                          className="w-full h-full object-cover scale-150"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">{news.authorName}</span>
                        <span className="text-[10px] text-gray-400">
                          Publicado em {new Date(news.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <span>❤️ {news.likes ?? 0}</span>
                      <span>💬 {news.comments ?? 0}</span>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {news.title}
                  </h1>

                  {/* Conteúdo formatado */}
                  <div
                    className="text-gray-700 break-words overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                </div>
              </article>

              {/* Seção de Comentários Integrada */}
              <CommentsSection newsId={id} />
            </>
          )}
        </main>
      </div>

      {/* Player Inferior */}
      <AudioPlayer />
    </div>
  );
}