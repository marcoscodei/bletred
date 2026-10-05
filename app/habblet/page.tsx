'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Crown } from 'lucide-react';

interface HotelStaff {
  name: string;
  role: string;
  avatar: string;
  badge: string;
  description: string;
}

const hotelStaff: HotelStaff[] = [
  {
    name: 'Habblet Owner',
    role: 'Fundador & Administrador Geral',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=Habblet&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Fundador',
    description: 'Idealizador e principal responsável pela infraestrutura e rumos do Habblet Hotel.',
  },
  {
    name: 'Coordenador',
    role: 'Coordenador de Operações',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=Frank&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Gestão',
    description: 'Supervisiona a equipa de staff, campanhas globais e a estabilidade do servidor.',
  },
  {
    name: 'GerenteEventos',
    role: 'Head de Eventos e Marketing',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=Mod-Habb&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Eventos',
    description: 'Criador das gincanas, jogos oficiais e dinâmicas que movimentam o hotel diariamente.',
  },
  {
    name: 'ModChefe',
    role: 'Líder de Moderação',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=El-Mago&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Moderação',
    description: 'Garante a segurança, o respeito e a harmonia entre todos os utilizadores do hotel.',
  },
];

export default function HabbletHotelPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          {/* Equipe do Habblet */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900">Administração & Equipe do Hotel</h1>
              <p className="text-xs text-gray-400 mt-0.5">Conhece os fundadores e moderadores que mantêm o hotel a funcionar</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Crown size={14} /> Staff Oficial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotelStaff.map((staff, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-4 group"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200 overflow-hidden flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    <img src={staff.avatar} alt={staff.name} className="object-cover translate-y-2" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    {staff.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-gray-900 text-sm">{staff.name}</h3>
                  <p className="text-xs font-semibold text-blue-600">{staff.role}</p>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  &quot;{staff.description}&quot;
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}