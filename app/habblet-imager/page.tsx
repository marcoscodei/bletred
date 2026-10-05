'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Image as ImageIcon, Copy, Download, Check, Sparkles, RefreshCw } from 'lucide-react';

export default function HabbletImagerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Estados dos controles do Imager
  const [nick, setNick] = useState('BletRed');
  const [gesture, setGesture] = useState('sml');
  const [action, setAction] = useState('std');
  const [handItem, setHandItem] = useState('0');
  const [size, setSize] = useState<'s' | 'm' | 'l'>('m');
  const [format, setFormat] = useState<'png' | 'jpeg' | 'gif'>('png');
  const [headDirection, setHeadDirection] = useState(2);
  const [bodyDirection, setBodyDirection] = useState(2);
  const [headOnly, setHeadOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  // Construção da URL da API do Habblet Vendas
  const apiUrl = `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(nick || 'BletRed')}&head_direction=${headDirection}&direction=${bodyDirection}&size=${size}&headsonly=${headOnly}&action=${action}&gesture=${gesture}&hand=${handItem}&img_format=${format}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = apiUrl;
    link.download = `${nick || 'avatar'}.${format}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <ImageIcon className="text-violet-600" size={24} /> Habblet Imager
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Ajuste o visual do avatar e exporte a imagem direto pela API oficial do Habblet Vendas.
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-1.5 self-start md:self-auto">
              <Sparkles size={14} /> {format.toUpperCase()} - Gerador ao Vivo
            </div>
          </div>

          {/* Grid Principal (Controles e Preview) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Painel Esquerdo: Controles */}
            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
              
              {/* Nick */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nick</label>
                <input
                  type="text"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  placeholder="Nome do usuário"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-violet-600 transition-colors"
                />
              </div>

              {/* Expressão & Ação */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Expressão</label>
                  <select
                    value={gesture}
                    onChange={(e) => setGesture(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:border-violet-600 transition-colors"
                  >
                    <option value="sml">Sorrindo</option>
                    <option value="srp">Sério</option>
                    <option value="drm">Dormindo</option>
                    <option value="std">Normal</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ação</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:border-violet-600 transition-colors"
                  >
                    <option value="std">Normal</option>
                    <option value="wlk">Andando</option>
                    <option value="sit">Sentado</option>
                  </select>
                </div>
              </div>

              {/* Item na mão */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Item na mão</label>
                <select
                  value={handItem}
                  onChange={(e) => setHandItem(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:border-violet-600 transition-colors"
                >
                  <option value="0">Nenhum</option>
                  <option value="1">Café</option>
                  <option value="2">Suco</option>
                  <option value="3">Hambúrguer</option>
                </select>
              </div>

              {/* Tamanho */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tamanho</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['s', 'm', 'l'] as const).map((sOpt) => (
                    <button
                      key={sOpt}
                      onClick={() => setSize(sOpt)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                        size === sOpt
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sOpt === 's' ? 'Pequeno' : sOpt === 'm' ? 'Médio' : 'Grande'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formato */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Formato</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpeg', 'gif'] as const).map((fOpt) => (
                    <button
                      key={fOpt}
                      onClick={() => setFormat(fOpt)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                        format === fOpt
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {fOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direção Cabeça */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700 uppercase">Cabeça</span>
                  <span className="text-xs font-black text-violet-600">{headDirection}</span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setHeadDirection((prev) => (prev > 1 ? prev - 1 : 8))}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <span
                        key={num}
                        className={`w-2 h-2 rounded-full ${headDirection === num ? 'bg-violet-600 scale-125' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setHeadDirection((prev) => (prev < 8 ? prev + 1 : 1))}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
                  >
                    <RefreshCw size={14} className="rotate-180" />
                  </button>
                </div>
              </div>

              {/* Direção Corpo */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700 uppercase">Corpo</span>
                  <span className="text-xs font-black text-violet-600">{bodyDirection}</span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setBodyDirection((prev) => (prev > 1 ? prev - 1 : 8))}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <span
                        key={num}
                        className={`w-2 h-2 rounded-full ${bodyDirection === num ? 'bg-violet-600 scale-125' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setBodyDirection((prev) => (prev < 8 ? prev + 1 : 1))}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 shadow-sm"
                  >
                    <RefreshCw size={14} className="rotate-180" />
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={headOnly}
                    onChange={(e) => setHeadOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300"
                  />
                  Só cabeça
                </label>
              </div>

            </div>

            {/* Painel Direito: Preview e URL */}
            <div className="lg:col-span-7 space-y-6 flex flex-col">
              
              {/* Preview Card */}
              <div className="flex-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col min-h-[380px] relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 z-10">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-violet-600" /> Pré-visualização ao vivo
                  </span>
                </div>

                <div className="flex-1 relative bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-violet-50/50 rounded-2xl flex items-center justify-center p-8 border border-dashed border-gray-200 my-4 overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  <div className="relative z-10 p-6 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-white flex items-center justify-center">
                    <img
                      src={apiUrl}
                      alt="Habblet Avatar Preview"
                      className="max-h-48 object-contain drop-shadow-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(nick || 'BletRed')}&size=m&direction=${bodyDirection}&head_direction=${headDirection}&gesture=${gesture}`;
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Caixa de URL Gerada */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">URL gerada</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Download size={14} /> Baixar
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 overflow-x-auto">
                  <code className="text-xs font-mono text-gray-600 whitespace-nowrap">
                    {apiUrl}
                  </code>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}