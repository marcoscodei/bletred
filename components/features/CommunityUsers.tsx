'use client';

import React, { useEffect, useState } from 'react';

interface CommunityUserItem {
  id: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export const CommunityUsers = () => {
  const [users, setUsers] = useState<CommunityUserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/community-users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar usuários da comunidade:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">👥 Usuários da comunidade</h3>
        <span className="text-[11px] text-violet-600 cursor-pointer hover:underline font-semibold">Ver todos &gt;</span>
      </div>

      <div className="bg-white border border-violet-100 rounded-2xl p-4 flex items-center justify-between overflow-x-auto gap-4 shadow-sm min-h-[96px] scrollbar-none">
        {loading ? (
          <div className="flex gap-4 w-full justify-between">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-14 h-16 bg-gray-50 rounded-xl animate-pulse shrink-0" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="w-full text-center text-xs text-gray-400 py-4">
            Nenhum usuário cadastrado ainda.
          </div>
        ) : (
          users.map((user, idx) => {
            const userName = user.username || user.name || 'Usuário';
            
            // Avatar do HabbletXD com base no username do utilizador registado
            const avatarUrl = user.avatar || `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(userName)}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG`;

            return (
              <div key={user.id || idx} className="flex flex-col items-center gap-1.5 min-w-[70px] shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-violet-600/60 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={avatarUrl} 
                    alt={userName} 
                    className="w-full h-full object-cover scale-150"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4c1d95&color=fff`;
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-800 truncate max-w-[70px]">{userName}</span>
                <span className="text-[9px] text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span> Online
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};