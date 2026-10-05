'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  label: string | null;
  imageUrl: string | null;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State simplificado (apenas Título e URL da Imagem)
  const [form, setForm] = useState({
    label: '',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadGallery = () => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar galeria:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({
          label: '',
          imageUrl: '',
        });
        loadGallery();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Erro ao adicionar item.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que desejas apagar este item da galeria?')) return;

    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        loadGallery();
      } else {
        alert('Erro ao apagar item.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-700/20">
            <ImageIcon size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900">Gerenciar Galeria</h1>
            <p className="text-[11px] text-slate-500">Adiciona imagens da arte e respetivos títulos à galeria.</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-full">
          Total: {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário de Criação Simplificado */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus size={16} className="text-red-600" /> Adicionar Arte
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Título</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                required
                placeholder="Ex: Arte Exclusiva #01"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">URL da Imagem da Arte</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                required
                placeholder="https://exemplo.com/imagem.png"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-800 transition-colors shadow-md shadow-red-700/20 disabled:opacity-50 mt-2"
            >
              {submitting ? 'A publicar...' : 'Publicar na Galeria'}
            </button>
          </form>
        </div>

        {/* Lista / Pré-visualização dos Itens */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 px-1">
            Artes Cadastradas
          </h3>

          {loading ? (
            <p className="text-xs text-slate-400">A carregar galeria...</p>
          ) : items.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 shadow-sm">
              Nenhuma arte adicionada na galeria até o momento.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="h-36 rounded-xl bg-slate-900 overflow-hidden relative group flex flex-col justify-end border border-slate-200 shadow-sm"
                >
                  {/* Imagem de Fundo se existir */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.label || 'Arte'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Gradiente de Overlay para legibilidade do texto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Botão de Apagar */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 text-white hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Apagar item"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Título / Label */}
                  <div className="relative p-2.5 z-10">
                    <span className="text-white font-bold text-xs block truncate">
                      {item.label || 'Sem Título'}
                    </span>
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