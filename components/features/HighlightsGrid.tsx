'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Megaphone, Gamepad2, Gift, Disc, LucideIcon } from 'lucide-react';

interface HighlightItem {
  id?: string;
  title: string;
  subtitle: string;
  iconName: string;
  imageUrl?: string | null; // <--- Adicionado para ler a imagem da base de dados
  link?: string;
}

// Mapeamento dinâmico dos ícones do Lucide
const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Megaphone,
  Gamepad2,
  Gift,
  Disc,
};

export const HighlightsGrid = () => {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">🔥 Destaques</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="bg-white border border-violet-100 rounded-2xl h-32 animate-pulse bg-gray-50" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          🔥 Destaques
        </h3>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">Ver todos &gt;</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {items.map((item, idx) => {
          const IconComponent = iconMap[item.iconName] || ShieldCheck;
          const hasImage = item.imageUrl && item.imageUrl.trim() !== '';

          return (
            <div 
              key={item.id || idx} 
              className="bg-white border border-violet-100 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md shadow-sm group"
            >
              {/* Se tiver imagem, mostra a imagem como capa. Se não, mostra o ícone com degradê. */}
              {hasImage ? (
                <div className="h-20 w-full overflow-hidden relative bg-slate-900">
                  <img
                    src={item.imageUrl!}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-20 bg-gradient-to-br from-violet-600 via-violet-700 to-blue-900 flex items-center justify-center text-white/95 group-hover:scale-105 transition-transform duration-300">
                  <IconComponent size={26} />
                </div>
              )}

              <div className="p-3">
                <h4 className="text-xs font-bold text-gray-900 mb-0.5">{item.title}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-1">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};