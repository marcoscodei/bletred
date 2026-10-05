'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Megaphone, 
  Gamepad2, 
  Gift, 
  Disc, 
  Plus, 
  Trash2, 
  Flame, 
  LucideIcon 
} from 'lucide-react';

interface HighlightItem {
  id?: string;
  title: string;
  subtitle: string;
  iconName: string;
  imageUrl?: string;
  link?: string;
}

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Megaphone,
  Gamepad2,
  Gift,
  Disc,
};

export default function AdminHighlightsPage() {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState<HighlightItem>({
    title: '',
    subtitle: '',
    iconName: 'ShieldCheck',
    imageUrl: '',
    link: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadHighlights = () => {
    fetch('/api/highlights')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar highlights:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHighlights();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: '', subtitle: '', iconName: 'ShieldCheck', imageUrl: '', link: '' });
        loadHighlights();
      } else {
        alert('Erro ao criar destaque.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Tens a certeza que desejas apagar este destaque?')) return;

    try {
      const res = await fetch(`/api/highlights`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        loadHighlights();
      } else {
        alert('Erro ao apagar destaque.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Cabeçalho da Seção */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-700/20">
            <Flame size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900">Gerenciar Destaques do Site</h1>
            <p className="text-[11px] text-slate-500">Adiciona ou remove os cards rápidos exibidos na página inicial com suporte a capa/imagem.</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-full">
          Total: {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Formulário de Criação */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus size={16} className="text-red-600" /> Novo Destaque
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Título</label>
              <input 
                type="text" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
                placeholder="Ex: Rádio Ao Vivo" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Subtítulo / Descrição Curta</label>
              <input 
                type="text" 
                value={form.subtitle} 
                onChange={e => setForm({...form, subtitle: e.target.value})} 
                required 
                placeholder="Ex: Ouça os melhores hits" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">URL da Capa / Imagem (Opcional)</label>
              <input 
                type="url" 
                value={form.imageUrl || ''} 
                onChange={e => setForm({...form, imageUrl: e.target.value})} 
                placeholder="https://exemplo.com/capa.png" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Ícone (Caso não use imagem)</label>
              <select 
                value={form.iconName} 
                onChange={e => setForm({...form, iconName: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800 font-medium"
              >
                <option value="ShieldCheck">ShieldCheck (Segurança/Verificação)</option>
                <option value="Megaphone">Megaphone (Anúncios/Comunicados)</option>
                <option value="Gamepad2">Gamepad2 (Jogos/Servidores)</option>
                <option value="Gift">Gift (Loja/Prêmios)</option>
                <option value="Disc">Disc (Rádio/Música)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Link de Destino (Opcional)</label>
              <input 
                type="text" 
                value={form.link || ''} 
                onChange={e => setForm({...form, link: e.target.value})} 
                placeholder="Ex: /loja ou https://..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-800 transition-colors shadow-md shadow-red-700/20 disabled:opacity-50"
            >
              {submitting ? 'A publicar...' : 'Publicar Destaque'}
            </button>
          </form>
        </div>

        {/* Lista de Destaques Atuais */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 px-1">
            Destaques Ativos na Home
          </h3>

          {loading ? (
            <p className="text-xs text-slate-400">A carregar destaques...</p>
          ) : items.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 shadow-sm">
              Nenhum destaque cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, idx) => {
                const IconComponent = iconMap[item.iconName] || ShieldCheck;
                return (
                  <div 
                    key={item.id || idx} 
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group"
                  >
                    <div>
                      {item.imageUrl ? (
                        <div className="h-24 w-full bg-slate-900 overflow-hidden relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="h-24 bg-gradient-to-br from-red-700 via-red-900 to-black flex items-center justify-center text-white">
                          <IconComponent size={24} />
                        </div>
                      )}
                      
                      <div className="p-4 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                        {item.link && (
                          <span className="text-[10px] text-red-600 font-semibold block truncate">
                            🔗 {item.link}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[11px] rounded-lg transition-colors"
                      >
                        <Trash2 size={13} /> Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}