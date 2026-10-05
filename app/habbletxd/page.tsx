'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  badge: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'BletRed',
    role: 'Fundador & Desenvolvedor',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=BletRed&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Fundador',
    description: 'Responsável pela arquitetura técnica e visão geral da plataforma e ecossistema.',
  },
  {
    name: 'AdminHabblet',
    role: 'Coordenador Geral',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=Frank&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Administração',
    description: 'Gerencia as operações diárias, equipas e eventos oficiais da comunidade.',
  },
  {
    name: 'VoiceXD',
    role: 'Diretor de Locução',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=Mod-Habb&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Locutor',
    description: 'Comanda a programação da rádio e anima os melhores horários do hotel.',
  },
  {
    name: 'NewsXD',
    role: 'Jornalista Chefe',
    avatar: 'https://www.habbo.com.br/habbo-imaging/avatarimage?user=El-Mago&headonly=0&size=m&direction=2&head_direction=2&gesture=sml',
    badge: 'Jornalista',
    description: 'Traz todas as novidades, campanhas e fofocas em primeira mão para os leitores.',
  },
];

export default function HabbletXDPage() {
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
          {/* Equipe HabbletXD */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900">Equipe HabbletXD</h1>
              <p className="text-xs text-gray-400 mt-0.5">Conhece os rostos por trás dos bastidores e do sucesso do projeto</p>
            </div>
            <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-xl">
              {teamMembers.length} Membros Ativos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-4 group"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 border-2 border-violet-200 overflow-hidden flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    <img src={member.avatar} alt={member.name} className="object-cover translate-y-2" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    {member.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-gray-900 text-sm">{member.name}</h3>
                  <p className="text-xs font-semibold text-violet-600">{member.role}</p>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  &quot;{member.description}&quot;
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}