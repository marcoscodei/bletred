'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { AUTH_EVENT, getStoredUser, saveUser } from '@/lib/auth-storage';

interface UserData {
  username: string;
  motto?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

interface ProfileHeaderProps {
  user?: UserData | null;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onEditProfileClick?: () => void;
}

// Componente do Banner de Patrocinadores (dinâmico com fallback para o HabbletXD)
const SponsorsBanner = () => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/sponsors')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSponsors(data);
      })
      .catch((err) => console.error("Erro ao carregar patrocinadores:", err));
  }, []);

  // Rotação automática a cada 5 segundos se houver múltiplos patrocinadores
  useEffect(() => {
    if (sponsors.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sponsors.length]);

  // Se não houver patrocinadores cadastrados, mostra o banner padrão do HabbletXD
  if (sponsors.length === 0) {
    return (
      <div className="h-full min-h-[220px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-900 to-slate-950 shadow-sm flex items-center px-10">
        <div className="absolute inset-0 bg-[radial-gradient(#a78bfa_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute -bottom-12 left-1/3 w-56 h-56 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <h1 className="relative text-5xl font-black italic tracking-tight text-white select-none -rotate-1">
          Habblet<span className="text-violet-400">XD</span>
        </h1>
        <span className="absolute bottom-6 right-8 text-[10px] font-bold text-white/70 uppercase tracking-widest text-right leading-snug">
          Juntos<br />somos<br />mais fortes
        </span>
      </div>
    );
  }

  const currentSponsor = sponsors[currentIndex];

  return (
    <div className="h-full min-h-[220px] rounded-2xl relative overflow-hidden bg-slate-950 shadow-sm flex items-center justify-between px-8 border border-indigo-900/30 group">
      {currentSponsor.imageUrl && (
        <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
          <img 
            src={currentSponsor.imageUrl} 
            alt={currentSponsor.name} 
            className="w-full h-full object-cover filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-center max-w-[65%]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-1">Patrocinador Oficial</span>
        <h3 className="text-2xl font-black text-white italic truncate">{currentSponsor.name}</h3>
        {currentSponsor.linkUrl && (
          <a 
            href={currentSponsor.linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-violet-600/30 w-fit cursor-pointer"
          >
            Visitar site &rarr;
          </a>
        )}
      </div>

      {currentSponsor.imageUrl && (
        <div className="relative z-10 w-24 h-24 rounded-2xl border-2 border-violet-600/50 overflow-hidden bg-gray-900 shrink-0 shadow-lg">
          <img src={currentSponsor.imageUrl} alt={currentSponsor.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Indicadores de slides se houver mais de um patrocinador */}
      {sponsors.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
          {sponsors.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-5 bg-violet-600' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ProfileHeader = ({
  user: propUser,
  onLoginClick,
  onRegisterClick,
  onEditProfileClick,
}: ProfileHeaderProps) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(propUser ?? null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (propUser) {
      setCurrentUser(propUser);
      return;
    }
    const sync = () => setCurrentUser(getStoredUser());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [propUser]);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      setAuthMode('register');
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    saveUser(userData);
    setIsAuthModalOpen(false);
  };

  // Visitante (não logado)
  if (!currentUser) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
          <div className="bg-white border border-violet-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-violet-100 shrink-0 text-gray-400">
                <UserIcon size={24} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Visitante</h2>
                <p className="text-xs text-gray-400">Faça login para interagir</p>
                <span className="text-[10px] text-amber-500 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Modo Visitante
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic my-4 leading-relaxed">
              "Entre na sua conta para publicar, comentar e fazer parte da comunidade."
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-violet-50">
              <button
                onClick={handleLoginClick}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-violet-600/20 cursor-pointer"
              >
                <LogIn size={14} /> Entrar
              </button>
              <button
                onClick={handleRegisterClick}
                className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                <UserPlus size={14} /> Registar
              </button>
            </div>
          </div>

          {/* Banner de Patrocinadores (Substitui o bloco estático) */}
          <SponsorsBanner />
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Logado
  const safeUsername = currentUser.username || '';
  const avatarUrl = `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(
    safeUsername
  )}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG`;

  const firstPart = safeUsername.slice(0, 4);
  const secondPart = safeUsername.slice(4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
      <div className="bg-white border border-violet-100 rounded-2xl p-5 flex flex-col shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-violet-100 shrink-0">
            <img
              src={avatarUrl}
              alt={safeUsername}
              className="w-full h-full object-cover scale-150"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop';
              }}
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{safeUsername}</h2>
            <p className="text-xs text-gray-400">@{safeUsername.toLowerCase()}</p>
            <span className="text-[10px] text-emerald-500 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 italic mt-4 leading-relaxed">
          "{currentUser.motto || 'Sempre em busca de novas conquistas.'}"
        </p>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-violet-50 text-center">
          <div>
            <div className="text-sm font-bold text-gray-900">{currentUser.postsCount ?? 0}</div>
            <div className="text-[10px] text-gray-400">Posts</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{currentUser.followersCount ?? 0}</div>
            <div className="text-[10px] text-gray-400">Seguidores</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{currentUser.followingCount ?? 0}</div>
            <div className="text-[10px] text-gray-400">Seguindo</div>
          </div>
        </div>

        <button
          onClick={onEditProfileClick}
          className="mt-5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-violet-600/20 cursor-pointer"
        >
          Editar perfil
        </button>
      </div>

      {/* Banner de Patrocinadores (Também disponível na visão logada) */}
      <SponsorsBanner />
    </div>
  );
};