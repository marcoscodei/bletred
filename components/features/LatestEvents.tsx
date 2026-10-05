'use client';

import React, { useEffect, useState } from 'react';

interface LatestEventItem {
  id: string;
  title: string;
  desc: string;
  imageUrl: string; // <--- Adicionado para receber a imagem
  day: string;
  month: string;
  linkUrl?: string;
}

export const LatestEvents = () => {
  const [events, setEvents] = useState<LatestEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/latest-events')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar últimos eventos:", err);
        setLoading(false);
      });
  }, []);

  const handleClick = (linkUrl?: string) => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
  };

  return (
    <div className="bg-white border border-violet-100 rounded-2xl p-4 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-violet-50 pb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">📅 Últimos eventos</h4>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">Ver todos &gt;</span>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="h-12 bg-gray-50 rounded-xl animate-pulse w-full" />
          ))
        ) : events.length === 0 ? (
          <div className="text-xs text-gray-400 text-center py-4">Nenhum evento recente.</div>
        ) : (
          events.map((ev, idx) => (
            <div 
              key={ev.id || idx} 
              onClick={() => handleClick(ev.linkUrl)}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-violet-50/60 p-1.5 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Miniatura da Imagem do Evento */}
                <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 border border-violet-100 shrink-0">
                  {ev.imageUrl ? (
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-violet-700 text-white flex items-center justify-center font-bold text-[10px]">
                      {ev.day}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{ev.title}</div>
                  <div className="text-[10px] text-gray-400 truncate">{ev.desc}</div>
                </div>
              </div>

              <span className="text-gray-300 pr-1 shrink-0">&gt;</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};