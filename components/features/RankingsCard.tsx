'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

interface RankItem {
  id: string;
  name: string;
  tag: string;
  points: number;
  position: number;
}

const AVATAR_BASE = 'https://api.habbletvendas.com.br/avatar';
const AVATAR_PARAMS = 'head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false';

const getAvatarUrl = (nick: string) => `${AVATAR_BASE}?nick=${encodeURIComponent(nick)}&${AVATAR_PARAMS}`;

export const RankingsCard = () => {
  const [activeTab, setActiveTab] = useState<'diario' | 'semanal' | 'mensal' | 'geral'>('diario');
  const [ranks, setRanks] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: 'diario', label: 'Diário' },
    { key: 'semanal', label: 'Semanal' },
    { key: 'mensal', label: 'Mensal' },
    { key: 'geral', label: 'Geral' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/rankings?period=${activeTab}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRanks(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar rankings:", err);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <div className="bg-white border border-violet-100 rounded-2xl p-4 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-violet-50 pb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">🏆 Rankings (Comentários)</h4>
        <span className="text-gray-300 cursor-pointer">&gt;</span>
      </div>

      <div className="flex gap-4 text-[11px] font-semibold border-b border-violet-50 pb-2">
        {tabs.map((tab) => (
          <span
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`cursor-pointer pb-1.5 transition-colors ${
              activeTab === tab.key
                ? 'text-violet-600 border-b-2 border-violet-600'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </span>
        ))}
      </div>

      <div className="space-y-3 min-h-[220px]">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : ranks.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            Ainda não há comentários registados neste período.
          </div>
        ) : (
          ranks.map((r, idx) => (
            <div key={r.id || idx} className="flex items-center gap-3 text-xs">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                idx === 0 ? 'bg-amber-400 text-black' : 
                idx === 1 ? 'bg-gray-300 text-black' : 
                idx === 2 ? 'bg-orange-400 text-white' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {r.position || idx + 1}
              </span>

              <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-violet-100 shrink-0">
                <img 
                  src={getAvatarUrl(r.name)} 
                  alt={r.name} 
                  className="w-full h-full object-cover scale-150"
                  onError={(e) => {
                    // Fallback visual caso o avatar falhe
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-gray-900">{r.name}</div>
                <div className="text-[10px] text-gray-400">{r.tag}</div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-violet-600">{r.points}</span>
                <span className="text-[9px] text-gray-400 block">comentários</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};