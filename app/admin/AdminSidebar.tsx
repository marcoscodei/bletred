'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarOff, 
  Image as ImageIcon, 
  Server, 
  ShoppingBag, 
  Calendar, 
  Mic, 
  Newspaper, 
  Flame, 
  LogOut,
  Clock // Ícone opcional para eventos
} from 'lucide-react';

const menuGroups = [
  {
    title: 'Painel',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Administração & Gestão',
    items: [
      { name: 'Gerenciar Utilizadores', href: '/admin/usuarios', icon: Users },
      { name: 'Desmarcar Horário', href: '/admin/desmarcar-horario', icon: CalendarOff },
      { name: 'Postar Banner', href: '/admin/banner', icon: ImageIcon },
      { name: 'Servidores em Destaque', href: '/admin/servidores', icon: Server },
      { name: 'Gerenciar Destaques', href: '/admin/destaques', icon: Flame },
      { name: 'Loja', href: '/admin/loja', icon: ShoppingBag },
    ]
  },
  {
    title: 'Promotor',
    items: [
      { name: 'Marcar Horário', href: '/admin/promotor/marcar-horario', icon: Calendar },
    ]
  },
  {
    title: 'Locutor',
    items: [
      { name: 'Marcar Horário', href: '/admin/locutor/marcar-horario', icon: Mic },
    ]
  },
  {
    title: 'Jornalista',
    items: [
      { name: 'Postar Notícias', href: '/admin/jornalista/noticias', icon: Newspaper },
      { name: 'Gerenciar Galeria', href: '/admin/jornalista/gallery', icon: ImageIcon },
      { name: 'Postar Últimos Eventos', href: '/admin/jornalista/eventos', icon: Clock }, // <--- ADICIONADO AQUI
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Remove o cookie de sessão do lado do cliente e redireciona
    document.cookie = 'bletred_session=; Max-Age=0; path=/;';
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm">
      {/* Cabeçalho / Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 shrink-0">
        <div className="w-10 h-10 bg-red-700 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-red-700/30">
          BR
        </div>
        <div>
          <h1 className="font-black text-slate-900 text-sm tracking-wide">BletRed</h1>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Painel Admin</p>
        </div>
      </div>

      {/* Navegação agrupada com scroll vertical */}
      <nav className="flex-1 px-4 py-4 space-y-5 text-xs overflow-y-auto">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5">
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold ${
                    isActive
                      ? 'bg-red-700 text-white shadow-md shadow-red-700/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Rodapé / Terminar Sessão */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs font-semibold cursor-pointer"
        >
          <LogOut size={16} />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
}