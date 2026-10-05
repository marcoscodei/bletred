'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Award, Search, Copy, Download, Check, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// Formato real retornado por https://api.habbletvendas.com.br/emblemas
interface BadgeItem {
  id: number;
  code: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const PAGE_SIZES = [30, 50, 100];

export default function EmblemsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Debounce da busca
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Busca na API real
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) params.set('search', search);

    fetch(`/api/emblemas?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Não foi possível carregar os emblemas.');
        return res.json();
      })
      .then((json: { data: BadgeItem[]; pagination: Pagination }) => {
        setBadges(json.data);
        setPagination(json.pagination);
        setSelectedBadge((prev) => prev ?? json.data[0] ?? null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Erro ao carregar emblemas.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, pageSize, search]);

  const handleCopyLink = () => {
    if (!selectedBadge) return;
    navigator.clipboard.writeText(selectedBadge.imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!selectedBadge) return;
    try {
      const res = await fetch(selectedBadge.imageUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${selectedBadge.code}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Se o servidor de imagens bloquear o download direto, abre em nova aba
      window.open(selectedBadge.imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Award className="text-violet-600" size={24} /> Emblemas Habblet
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Catálogo real de emblemas, carregado direto da API do Habblet Vendas.
              </p>
            </div>
            <div className="bg-violet-50 text-violet-700 px-4 py-2 rounded-2xl text-xs font-bold border border-violet-100 flex items-center gap-1.5 self-start md:self-auto">
              <Sparkles size={14} />
              {pagination ? `${pagination.total.toLocaleString('pt-BR')} emblemas indexados` : 'Carregando...'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Coluna Esquerda: Busca e lista */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar por código ou descrição..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:border-violet-600 transition-colors"
                  />
                </div>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-2xl px-3 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:border-violet-600"
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s} por página
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lista de Emblemas</span>
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-xl">
                    {pagination ? `${pagination.total.toLocaleString('pt-BR')} encontrados` : '—'}
                  </span>
                </div>

                {error && (
                  <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl p-3">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
                    <Loader2 className="animate-spin" size={18} /> Carregando emblemas...
                  </div>
                ) : badges.length === 0 && !error ? (
                  <div className="py-16 text-center text-sm text-gray-400">Nenhum emblema encontrado.</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                    {badges.map((badge) => {
                      const isSelected = selectedBadge?.id === badge.id;
                      return (
                        <button
                          key={badge.id}
                          onClick={() => setSelectedBadge(badge)}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-violet-50 border-violet-600 shadow-sm ring-2 ring-violet-600/20'
                              : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                          }`}
                        >
                          <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 shrink-0 flex items-center justify-center p-1">
                            <img
                              src={badge.imageUrl}
                              alt={badge.code}
                              loading="lazy"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block font-mono font-bold text-xs text-gray-900 truncate">{badge.code}</span>
                            <span className="block text-[10px] text-gray-400 truncate">{badge.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Paginação */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || loading}
                      className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 rounded-xl transition-colors"
                    >
                      <ChevronLeft size={14} /> Anterior
                    </button>
                    <span className="text-xs font-semibold text-gray-500">
                      Página {pagination.page} de {pagination.totalPages.toLocaleString('pt-BR')}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page >= pagination.totalPages || loading}
                      className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 rounded-xl transition-colors"
                    >
                      Próxima <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita: Detalhes e ações */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6 flex flex-col items-center text-center">
                {selectedBadge ? (
                  <>
                    <div className="space-y-1">
                      <h2 className="text-xl font-black text-gray-900">{selectedBadge.name}</h2>
                      <code className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg inline-block mt-1">
                        {selectedBadge.code}
                      </code>
                      {selectedBadge.description && selectedBadge.description.trim().length > 1 && (
                        <p className="text-xs text-gray-500 pt-3 leading-relaxed">{selectedBadge.description}</p>
                      )}
                    </div>

                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-dashed border-violet-200 flex items-center justify-center p-4 shadow-inner">
                      <img
                        src={selectedBadge.imageUrl}
                        alt={selectedBadge.code}
                        className="max-w-full max-h-full object-contain drop-shadow-md"
                      />
                    </div>

                    <div className="w-full space-y-3 pt-2">
                      <button
                        onClick={handleCopyLink}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-4 rounded-2xl text-xs transition-colors shadow-md shadow-violet-600/20 flex items-center justify-center gap-2"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Link Copiado com Sucesso!' : 'Copiar Link Direto'}
                      </button>

                      <button
                        onClick={handleDownload}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={16} /> Baixar Emblema (.gif)
                      </button>
                    </div>

                    <div className="w-full pt-4 border-t border-gray-100 text-left space-y-1.5">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">URL Direta</span>
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 overflow-x-auto">
                        <code className="text-[11px] font-mono text-gray-600 whitespace-nowrap">
                          {selectedBadge.imageUrl}
                        </code>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 py-12">Selecione um emblema para ver os detalhes.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}