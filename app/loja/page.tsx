'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Award, Shield, Package, ShoppingCart, Plus, Minus, Loader2, Coins } from 'lucide-react';

// Formato real retornado por https://www.habbletvendas.com.br/api/lojasite
interface StoreItem {
  id: number;
  nome: string;
  imagem: string;
  type: string; // ex: "emblema", "Raro"
  coins: string; // "coins" (pago com coins) ou "gratis"
  createdAt: string;
  preco: number;
  desc: string;
  estoque: number;
}

interface CartItem extends StoreItem {
  quantity: number;
}

const isFree = (item: StoreItem) => item.coins?.toLowerCase() === 'gratis';
const typeLabel = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : 'Outros');

const typeIcon = (t: string) => {
  const key = t.toLowerCase();
  if (key === 'emblema') return <Award className="text-violet-500" size={22} />;
  if (key === 'raro') return <Shield className="text-blue-500" size={22} />;
  return <Package className="text-emerald-500" size={22} />;
};

export default function StorePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/loja-catalogo', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Não foi possível carregar a loja.');
        return res.json();
      })
      .then((json: { data: StoreItem[] }) => setItems(json.data ?? []))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Erro ao carregar a loja.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Categorias vêm dos tipos reais retornados pela API
  const categories = useMemo(() => {
    const types = Array.from(new Set(items.map((i) => (i.type || '').toLowerCase()).filter(Boolean)));
    return ['Todos', ...types];
  }, [items]);

  const filteredItems =
    selectedCategory === 'Todos' ? items : items.filter((i) => (i.type || '').toLowerCase() === selectedCategory);

  const addToCart = (item: StoreItem) => {
    if (item.estoque <= 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        if (existing.quantity >= item.estoque) return prev;
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: Math.min(c.estoque, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const totalCoins = cart.reduce((sum, c) => sum + (isFree(c) ? 0 : c.preco * c.quantity), 0);
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);

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
            <h1 className="text-xl font-black text-gray-900">Emblemas & Raros</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Itens carregados direto da loja real. Os resgates serão feitos com coins.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Lista de Produtos */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 p-2 rounded-2xl shadow-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-violet-50 hover:text-gray-900'
                    }`}
                  >
                    {cat === 'Todos' ? 'Todos' : typeLabel(cat)}
                  </button>
                ))}
              </div>

              {error && (
                <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl p-3">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center gap-2 py-24 text-sm text-gray-400">
                  <Loader2 className="animate-spin" size={18} /> Carregando loja...
                </div>
              ) : filteredItems.length === 0 && !error ? (
                <div className="py-24 text-center text-sm text-gray-400">Nenhum item disponível.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => {
                    const soldOut = item.estoque <= 0;
                    const inCart = cart.find((c) => c.id === item.id)?.quantity ?? 0;
                    const maxed = inCart >= item.estoque;
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
                      >
                        <span className="absolute top-6 right-6 bg-violet-50 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                          {typeIcon(item.type)} {typeLabel(item.type)}
                        </span>

                        <div className="space-y-3">
                          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2">
                            <img src={item.imagem} alt={item.nome} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-extrabold text-gray-900 text-sm">{item.nome}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                            <p className={`text-[11px] font-semibold ${soldOut ? 'text-red-500' : 'text-gray-400'}`}>
                              {soldOut ? 'Esgotado' : `${item.estoque} em estoque`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-base font-black text-violet-600 flex items-center gap-1.5">
                            {isFree(item) ? (
                              'Grátis'
                            ) : (
                              <>
                                <Coins size={16} /> {item.preco}
                              </>
                            )}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            disabled={soldOut || maxed}
                            className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
                          >
                            <ShoppingCart size={14} /> {soldOut ? 'Esgotado' : 'Adicionar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Carrinho */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="text-violet-600" size={18} /> Carrinho
                  </h2>
                  <span className="text-xs font-semibold text-gray-400">{totalItems} itens</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400 space-y-2">
                    <ShoppingCart size={32} className="mx-auto text-gray-300" />
                    <p>O teu carrinho está vazio.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {cart.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                        >
                          <div className="w-9 h-9 bg-white rounded-lg border border-gray-200 shrink-0 flex items-center justify-center p-1">
                            <img src={c.imagem} alt={c.nome} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-gray-900 truncate">{c.nome}</h4>
                            <span className="text-[11px] font-semibold text-violet-600">
                              {isFree(c) ? 'Grátis' : `${c.preco} coins`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQuantity(c.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-gray-900 w-4 text-center">{c.quantity}</span>
                            <button
                              onClick={() => updateQuantity(c.id, 1)}
                              disabled={c.quantity >= c.estoque}
                              className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-gray-500">Total</span>
                        <span className="font-black text-gray-900 text-lg flex items-center gap-1.5">
                          <Coins size={18} className="text-amber-500" /> {totalCoins} coins
                        </span>
                      </div>

                      {/* Resgate por coins ainda não existe no backend: botão desativado, sem compra simulada */}
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-500 font-bold py-3.5 px-4 rounded-2xl text-xs cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Resgatar com Coins (em breve)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}