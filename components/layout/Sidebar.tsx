'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Compass, Sparkles, Gamepad2, Code, ShoppingBag, X, 
  ChevronDown, ChevronUp, Image as ImageIcon, Award 
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  badge?: string;
  label: string;
  href: string;
}

const NavItem = ({ icon, badge, label, href }: NavItemProps) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link 
      href={href}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all font-semibold text-sm ${
        active 
          ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md shadow-violet-600/20' 
          : 'text-gray-500 hover:bg-violet-50 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-fuchsia-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  
  // Abre o menu de APIs automaticamente se o utilizador estiver numa das sub-páginas
  const isApiRoute = pathname === '/habblet-imager' || pathname === '/emblemas';
  const [isApisOpen, setIsApisOpen] = useState(isApiRoute);

  return (
    <>
      {/* Fundo escuro translúcido para telemóveis quando aberto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar retrátil controlada pelo estado */}
      <aside className={`w-64 bg-white border-r border-violet-100 flex flex-col py-5 px-3 gap-6 fixed h-full z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center font-black text-lg shadow-md shadow-violet-600/30 text-white">
              B
            </div>
            <span className="font-extrabold text-lg text-gray-900">HabbletXd</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-violet-50 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto">
          <NavItem icon={<Home size={18} />} label="Início" href="/" />
          <NavItem icon={<Compass size={18} />} label="Comunidade" href="/comunidade" />
          <NavItem icon={<Sparkles size={18} />} label="HabbletXD" href="/habbletxd" />
          <NavItem icon={<Gamepad2 size={18} />} label="Habblet Hotel" href="/habblet" />

          {/* Menu Dropdown para API's / Ferramentas */}
          <div className="space-y-1">
            <button
              onClick={() => setIsApisOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all font-semibold text-sm ${
                isApiRoute
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-500 hover:bg-violet-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Code size={18} />
                <span>API's & Ferramentas</span>
              </div>
              {isApisOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Sub-opções */}
            {isApisOpen && (
              <div className="pl-6 space-y-1 pt-1 border-l-2 border-violet-100 ml-3">
                <Link
                  href="/habblet-imager"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    pathname === '/habblet-imager'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-violet-50 hover:text-gray-900'
                  }`}
                >
                  <ImageIcon size={15} />
                  <span>Habblet Imager</span>
                </Link>

                <Link
                  href="/emblemas"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    pathname === '/emblemas'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-violet-50 hover:text-gray-900'
                  }`}
                >
                  <Award size={15} />
                  <span>Emblemas</span>
                </Link>
              </div>
            )}
          </div>

          <NavItem icon={<ShoppingBag size={18} />} label="Loja" href="/loja" />
        </nav>
      </aside>
    </>
  );
};