'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, ExternalLink, ArrowUpDown } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
}

export default function AdminBannersPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [order, setOrder] = useState('0');

  const fetchSponsors = async () => {
    try {
      const res = await fetch('/api/sponsors');
      const data = await res.json();
      if (Array.isArray(data)) setSponsors(data);
    } catch (err) {
      console.error('Erro ao buscar banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) return alert('Preencha o nome e a imagem!');

    setSubmitting(true);
    try {
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imageUrl, linkUrl, order }),
      });

      if (res.ok) {
        setName('');
        setImageUrl('');
        setLinkUrl('');
        setOrder('0');
        fetchSponsors();
      } else {
        alert('Erro ao cadastrar banner.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres remover este patrocinador?')) return;

    try {
      const res = await fetch(`/api/sponsors?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSponsors();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gerenciar Banners / Patrocinadores</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cadastra os patrocinadores oficiais que vão aparecer em rotação automática no banner principal da comunidade.
          </p>
        </div>
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold">
          <ImageIcon size={24} />
        </div>
      </div>

      {/* Grid: Formulário + Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Adicionar Novo Patrocinador</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Nome do Patrocinador</label>
              <input
                type="text"
                placeholder="Ex: Habblet Vendas"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">URL da Imagem / Banner</label>
              <input
                type="url"
                placeholder="https://exemplo.com/banner.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Link de Destino (Opcional)</label>
              <input
                type="url"
                placeholder="https://siteparceiro.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-600 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Ordem de Exibição</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-600 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} /> {submitting ? 'A salvar...' : 'Publicar Patrocinador'}
            </button>
          </form>
        </div>

        {/* Listagem dos Banners Cadastrados */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Patrocinadores Ativos ({sponsors.length})</h2>

          {loading ? (
            <p className="text-xs text-slate-400">A carregar patrocinadores...</p>
          ) : sponsors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs">
              Nenhum patrocinador cadastrado ainda. O banner padrão do HabbletXD está a ser exibido.
            </div>
          ) : (
            <div className="space-y-3">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={sponsor.imageUrl} alt={sponsor.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{sponsor.name}</h3>
                    {sponsor.linkUrl ? (
                      <a href={sponsor.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-0.5 truncate">
                        {sponsor.linkUrl} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Sem link de destino</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      Ordem: {sponsor.order}
                    </span>
                    <button
                      onClick={() => handleDelete(sponsor.id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      title="Deletar patrocinador"
                    >
                      <Trash2 size={16} />
                    </button>
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