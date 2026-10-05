'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Crown, Flame, Users, Star, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';

interface EmblemItem {
  id?: string;
  code?: string;
  title?: string;
  name?: string;
  desc?: string;
  description?: string;
  iconName?: string;
  imageUrl?: string;
  image?: string;
}

// Mapeamento dinâmico dos ícones do Lucide
const iconMap: Record<string, LucideIcon> = {
  Crown,
  Flame,
  Users,
  Star,
};

export const EmblemsCard = () => {
  const [emblems, setEmblems] = useState<EmblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/emblemas?page=1&pageSize=50&search=')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data.results || data.list || data.content || data.items || data.data || data.emblems || [];

        setEmblems(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar emblemas:", err);
        setLoading(false);
      });
  }, []);

  // Funções para deslizar para a esquerda e direita
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white border border-violet-100 rounded-2xl p-4 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-violet-50 pb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">🛡️ Emblemas</h4>
        
        {/* Botões de navegação lateral para passar pro lado */}
        <div className="flex items-center gap-1">
          <button
            onClick={scrollLeft}
            className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all cursor-pointer"
            title="Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={scrollRight}
            className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all cursor-pointer"
            title="Seguinte"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Container horizontal com scroll suave */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="min-w-[140px] h-24 bg-gray-50 rounded-xl animate-pulse shrink-0" />
            ))
          ) : emblems.length === 0 ? (
            <div className="w-full text-center text-xs text-gray-400 py-6">
              Nenhum emblema encontrado.
            </div>
          ) : (
            emblems.map((e, idx) => {
              const title = e.title || e.name || e.code || 'Emblema';
              const desc = e.desc || e.description || '';
              const imageUrl = e.imageUrl || e.image;
              const IconComponent = iconMap[e.iconName || ''] || Crown;

              return (
                <div
                  key={e.id || idx}
                  className="min-w-[140px] max-w-[140px] bg-white border border-violet-100 rounded-xl overflow-hidden text-center shadow-sm flex flex-col shrink-0"
                >
                  <div className="h-14 bg-gradient-to-br from-violet-600 via-violet-700 to-blue-900 flex items-center justify-center text-white/95">
                    {imageUrl ? (
                      <img src={imageUrl} alt={title} className="w-8 h-8 object-contain" />
                    ) : (
                      <IconComponent size={20} />
                    )}
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-center">
                    <span className="text-xs font-bold text-gray-900 block truncate">{title}</span>
                    <span className="text-[10px] text-gray-400 truncate">{desc}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};