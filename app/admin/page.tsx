'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Calendar, ShoppingBag, Bell, Plus, ShieldAlert } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'announcements' | 'users' | 'events' | 'store'>('announcements');
  
  // Data States
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', author: 'Direção Superior' });

  const router = useRouter();

  const loadData = () => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcementForm)
    });
    setAnnouncementForm({ title: '', content: '', author: 'Direção Superior' });
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
      
      {/* Abas do Painel */}
      <div className="flex gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
            activeTab === 'announcements' ? 'bg-red-700 text-white shadow-md shadow-red-700/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Bell size={16} /> Avisos e Comunicados ({announcements.length})
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
            activeTab === 'users' ? 'bg-red-700 text-white shadow-md shadow-red-700/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users size={16} /> Gerenciar Usuários
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
            activeTab === 'events' ? 'bg-red-700 text-white shadow-md shadow-red-700/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar size={16} /> Gerenciar Eventos
        </button>
        <button 
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
            activeTab === 'store' ? 'bg-red-700 text-white shadow-md shadow-red-700/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag size={16} /> Gerenciar Loja
        </button>
      </div>

      {/* CONTEÚDO DA ABA: AVISOS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulário de Publicação */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800">
              <Plus size={16} className="text-red-600" /> Publicar Novo Aviso
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Título</label>
                <input 
                  type="text" 
                  value={announcementForm.title} 
                  onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
                  placeholder="Ex: Atualização de Diretrizes"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Cargo / Autor</label>
                <input 
                  type="text" 
                  value={announcementForm.author} 
                  onChange={e => setAnnouncementForm({...announcementForm, author: e.target.value})} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Mensagem</label>
                <textarea 
                  rows={4}
                  value={announcementForm.content} 
                  onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800 resize-none"
                  placeholder="Escreva o comunicado oficial..."
                />
              </div>
              <button type="submit" className="w-full bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-800 transition-colors shadow-md shadow-red-700/20">
                Enviar Comunicado
              </button>
            </form>
          </div>

          {/* Lista de Avisos Publicados */}
          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <p className="text-xs text-slate-400">A carregar avisos...</p>
            ) : announcements.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 shadow-sm">
                Nenhum aviso publicado.
              </div>
            ) : (
              announcements.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-700"></div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-full">
                        <ShieldAlert size={12} /> {item.author}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {item.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* OUTRAS ABAS */}
      {activeTab !== 'announcements' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-xs text-slate-500 space-y-2 shadow-sm">
          <p className="font-bold text-slate-800 text-sm uppercase">Painel de Gerenciamento: {activeTab}</p>
          <p>Aqui podes encaixar os formulários e tabelas para controlar os itens desta seção.</p>
        </div>
      )}

    </div>
  );
}