'use client';

import React, { useEffect, useState } from 'react';
import { Crown, Image as ImageIcon, Gem, LucideIcon } from 'lucide-react';

interface StoreProductItem {
  id?: string;
  code?: string;
  title?: string;
  name?: string;
  price?: string | number;
  cost?: string | number;
  iconName?: string;
  imageUrl?: string;
  image?: string;
  foto?: string;
  img?: string;
  imagem?: string;
  url?: string;
}

// Mapeamento dinâmico dos ícones do Lucide
const iconMap: Record<string, LucideIcon> = {
  Crown,
  Image: ImageIcon,
  Gem,
};

interface StoreItemRowProps {
  title: string;
  price: string | number;
  imageUrl?: string;
  IconComponent: LucideIcon;
}

// Sub-componente isolado: aqui o useState é totalmente válido porque está no topo de um componente React próprio
function StoreItemRow({ title, price, imageUrl, IconComponent }: StoreItemRowProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-violet-50/60 transition-colors cursor-pointer">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-blue-700 text-white flex items-center justify-center shrink-0 overflow-hidden relative border border-violet-50">
          {imageUrl && !hasError ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={() => setHasError(true)}
            />
          ) : (
            <IconComponent size={18} />
          )}
        </div>
        <div className="min-w-0">
          <span className="text-xs font-bold text-gray-900 block truncate">{title}</span>
          <span className="text-[10px] text-gray-400">🪙 {price}</span>
        </div>
      </div>
      <span className="text-gray-300 pr-1 shrink-0">&gt;</span>
    </div>
  );
}

export const StoreCard = () => {
  const [products, setProducts] = useState<StoreProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/store')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data.results || data.list || data.content || data.items || data.data || data.products || [];

        setProducts(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos da loja:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white border border-violet-100 rounded-2xl p-4 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-violet-50 pb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">🛒 Loja</h4>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">Ver todos &gt;</span>
      </div>

      <div className="space-y-2 min-h-[160px]">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="h-12 bg-gray-50 rounded-xl animate-pulse w-full" />
          ))
        ) : products.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-6">
            Nenhum produto encontrado na loja.
          </div>
        ) : (
          products.map((p, idx) => {
            const title = p.title || p.name || 'Produto';
            const price = p.price || p.cost || '0';
            const rawImage = p.imageUrl || p.image || p.foto || p.img || p.imagem || p.url;
            const IconComponent = iconMap[p.iconName || ''] || Crown;

            return (
              <StoreItemRow 
                key={p.id || idx}
                title={title}
                price={price}
                imageUrl={rawImage}
                IconComponent={IconComponent}
              />
            );
          })
        )}
      </div>
    </div>
  );
};