'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, ExternalLink, Clock } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  dateText: string;
  linkUrl?: string;
}

export default function AdminEventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dateText, setDateText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/jornalista/eventos');
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl || !dateText) return alert('Preencha o título, a imagem e a data do evento!');

    setSubmitting(true);
    try {
      const res = await fetch('/api/jornalista/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, imageUrl, dateText, linkUrl }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setImageUrl('');
        setDateText('');
        setLinkUrl('');
        fetchEvents();
      } else {
        alert('Erro ao publicar evento.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres remover este evento?')) return;

    try {
      const res = await fetch(`/api/jornalista/eventos?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Postar Últimos Eventos</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencia os eventos recentes da comunidade que aparecem em destaque para os utilizadores.
          </p>
        </div>
        <div className="w-12 h-12 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center font-bold shadow-sm">
          <Clock size={24} />
        </div>
      </div>

      {/* Grid: Formulário + Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Novo Evento</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Título do Evento</label>
              <input
                type="text"
                placeholder="Ex: Noite de Gala Habblet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-700 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Data / Horário (Texto)</label>
              <input
                type="text"
                placeholder="Ex: Hoje às 21:00 BRT"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-700 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">URL da Imagem / Banner</label>
              <input
                type="url"
                placeholder="https://exemplo.com/evento.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-700 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Breve Descrição (Opcional)</label>
              <textarea
                rows={3}
                placeholder="Detalhes rápidos sobre o evento..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-700 font-medium resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Link de Destino / Participação (Opcional)</label>
              <input
                type="url"
                placeholder="https://exemplo.com/topico"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-red-700 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-red-700/20 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} /> {submitting ? 'A publicar...' : 'Publicar Evento'}
            </button>
          </form>
        </div>

        {/* Listagem dos Eventos Cadastrados */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Eventos Publicados ({events.length})</h2>

          {loading ? (
            <p className="text-xs text-slate-400">A carregar eventos...</p>
          ) : events.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs">
              Nenhum evento postado recentemente.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{event.title}</h3>
                      <span className="text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded-md shrink-0">
                        {event.dateText}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-slate-500 truncate">{event.description}</p>
                    )}
                    {event.linkUrl && (
                      <a href={event.linkUrl} target="_blank" rel="noreferrer" className="text-[11px] text-red-700 hover:underline flex items-center gap-1 w-fit truncate">
                        Ver Link <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      title="Deletar evento"
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