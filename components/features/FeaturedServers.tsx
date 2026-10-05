'use client';

import React, { useEffect, useState } from 'react';
import { Crown, Gamepad2, Users, Music, LucideIcon } from 'lucide-react';

interface ServerItem {
  id: string;
  title: string;
  subtitle: string;
  online: string;
  members: string;
  iconName: string;
}

// Mapeamento dinâmico dos ícones do Lucide
const iconMap: Record<string, LucideIcon> = {
  Crown,
  Gamepad2,
  Users,
  Music,
};

export const FeaturedServers = () => {
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/servers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar servidores:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">🖥️ Servidores em destaque</h3>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">Ver todos &gt;</span>
      </div>

      <div className="bg-white border border-violet-100 rounded-2xl p-3 space-y-2 shadow-sm min-h-[220px]">
        {loading ? (
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))
        ) : (
          servers.map((server, idx) => {
            const IconComponent = iconMap[server.iconName] || Crown;
            return (
              <div key={server.id || idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-violet-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
                    <IconComponent size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">{server.title}</h5>
                    <p className="text-[10px] text-gray-400">{server.subtitle}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{server.online} · {server.members}
                    </p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white text-[11px] font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm shadow-violet-600/20 shrink-0">
                  Entrar
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};