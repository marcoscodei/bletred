'use client';

import React, { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  label: string | null;
  style: string | null;
  imageUrl: string | null;
}

export const GallerySection = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar galeria:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900">🖼️ Galeria</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-28 rounded-xl bg-gray-50 border border-violet-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">🖼️ Galeria</h3>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">Ver todos &gt;</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {items.map((item, idx) => (
          <div 
            key={item.id || idx} 
            className="h-28 rounded-xl bg-slate-900 overflow-hidden relative group cursor-pointer shadow-sm flex flex-col justify-end border border-slate-200"
          >
            {/* Imagem da Arte */}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.label || 'Arte da galeria'}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {/* Gradiente de overlay para destacar o texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/85 via-indigo-900/30 to-transparent"></div>

            {/* Título / Label */}
            {item.label && (
              <div className="relative p-2.5 z-10">
                <span className={`text-white font-black block truncate ${item.style || 'text-xs'}`}>
                  {item.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};