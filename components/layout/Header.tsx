'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, Users, ChevronDown, Menu, LogIn, LogOut } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import {
  AUTH_EVENT,
  getStoredUser,
  saveUser,
  clearUser,
  StoredUser,
} from '@/lib/auth-storage';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleLogout = () => {
    clearUser();
    setShowDropdown(false);
  };

  return (
    <>
      <header className="h-16 border-b border-violet-100 px-6 sm:px-8 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-gray-600 hover:bg-violet-50 transition-colors cursor-pointer"
            title="Alternar menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center font-black text-sm shadow-md shadow-violet-600/30 text-white">
              B
            </div>
            <span className="font-extrabold text-base text-gray-900 hidden sm:inline">HabbletXd</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-gray-100 border border-violet-100 rounded-full pl-9 pr-4 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 w-64 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <div className="relative">
              <Bell size={18} className="cursor-pointer hover:text-gray-800" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-fuchsia-500"></span>
            </div>
            <Users size={18} className="cursor-pointer hover:text-gray-800 hidden sm:block" />
          </div>

          {/* Área de Autenticação / Perfil do Usuário */}
          <div className="relative border-l border-violet-100 pl-6">
            {user ? (
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-violet-600 shrink-0">
                  <img
                    src={
                      user.avatar ||
                      `https://api.habbletvendas.com.br/avatar?nick=${encodeURIComponent(
                        user.username
                      )}&head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false`
                    }
                    alt={user.username}
                    className="w-full h-full object-cover mt-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-gray-900">{user.username}</span>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />

                {showDropdown && (
                  <div className="absolute right-0 top-12 w-40 bg-white rounded-2xl shadow-xl border border-violet-50 py-2 z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-violet-600 hover:bg-violet-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} /> Sair da conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 cursor-pointer"
              >
                <LogIn size={14} /> Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => {
          saveUser(userData);
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
};