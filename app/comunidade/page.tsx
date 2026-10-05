'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Search } from 'lucide-react';

interface CommunityMember {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  motto?: string;
  status: string;
  postsCount: number;
  followers: number;
  following: number;
}

export default function CommunityPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/community-users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar membros:', err);
        setLoading(false);
      });
  }, []);

  // Filtra os membros com base na pesquisa
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* Título */}
          <div>
            <h1 className="text-xl font-black text-gray-900">Comunidade BletRed</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? 'Carregando membros...' : `${members.length} membros registados`}
            </p>
          </div>

          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar membro por nome ou utilizador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          {/* Grelha de Membros */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-48 bg-white border border-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 text-sm">
              Nenhum membro encontrado com &quot;{searchQuery}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-violet-100 border border-violet-200 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={member.avatar || 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=BletRed&headonly=1&size=m'}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 truncate text-sm">{member.name}</h3>
                      </div>
                      <p className="text-xs text-violet-600 font-semibold">@{member.username}</p>
                      <p className="text-[11px] text-gray-400 italic truncate mt-1">
                        &quot;{member.motto || 'Integrante da comunidade'}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Estatísticas do Membro */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                    <div>
                      <span className="block text-xs font-bold text-gray-900">{member.postsCount}</span>
                      <span className="text-[10px] text-gray-400 uppercase">Posts</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">{member.followers}</span>
                      <span className="text-[10px] text-gray-400 uppercase">Seguidores</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">{member.following}</span>
                      <span className="text-[10px] text-gray-400 uppercase">Seguindo</span>
                    </div>
                  </div>

                  {/* Rodapé do Card */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {member.status || 'Online'}
                    </span>
                    <button className="text-violet-600 font-semibold hover:underline">
                      Ver Perfil &gt;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}