'use client';

import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, User as UserIcon } from 'lucide-react';

interface UserItem {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
}

// Letras sem acento, números e símbolos aceitos em nicks do Habbo (máx. 15)
const NICK_REGEX = /^[a-zA-Z0-9\-=?!@:.,]{1,15}$/;

// API do Habblet Vendas (só a cabeça)
const AVATAR_BASE = 'https://api.habbletvendas.com.br/avatar';
const AVATAR_PARAMS =
  'head_direction=3&direction=2&size=l&gesture=sml&headonly=true&action=std&img_format=PNG&cash=false';

const getAvatarUrl = (nick: string) =>
  `${AVATAR_BASE}?nick=${encodeURIComponent(nick)}&${AVATAR_PARAMS}`;

/**
 * Avatar que preenche todo o contentor (círculo/quadrado).
 * - object-cover + scale-150: amplia a cabeça para cobrir o círculo
 *   (para ampliar mais/menos, troca scale-150 por scale-125, scale-[1.75], etc.)
 * - referrerPolicy="no-referrer": evita bloqueio por hotlink
 * - onError / imagem de 1px: cai no ícone
 */
function AvatarImg({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  // Se o src mudar (ex.: a escrever o nick), tenta de novo
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
        title={alt}
      >
        <UserIcon size={22} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={`w-full h-full object-cover scale-150 ${className}`}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth <= 1 || img.naturalHeight <= 1) setFailed(true);
      }}
    />
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State (Apenas Nick, Senha e Cargo)
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'LOCUTOR',
  });
  const [submitting, setSubmitting] = useState(false);

  const trimmedNick = form.username.trim();
  const nickIsValid = NICK_REGEX.test(trimmedNick);

  const loadUsers = () => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar utilizadores:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickIsValid) {
      alert('Nick inválido. Use apenas letras sem acento, números e - = ? ! @ : . ,');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, username: trimmedNick }),
      });

      if (res.ok) {
        setForm({
          username: '',
          password: '',
          role: 'LOCUTOR',
        });
        loadUsers();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Erro ao criar utilizador.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (username === 'admin') {
      alert('Não podes apagar o administrador principal.');
      return;
    }

    if (!confirm(`Tens a certeza que desejas apagar o utilizador "${username}"?`)) return;

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        loadUsers();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Erro ao apagar utilizador.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Cabeçalho */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-700/20">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900">Gerenciar Utilizadores</h1>
            <p className="text-[11px] text-slate-500">Cria novas contas de acesso e administra os cargos da equipa.</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-full">
          Total: {users.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Formulário de Criação de Conta */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserPlus size={16} className="text-red-600" /> Criar Nova Conta
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Nick (Username)</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                maxLength={15}
                placeholder="Ex: marcosboni"
                className={`w-full bg-slate-50 border rounded-xl p-2.5 outline-none text-slate-800 ${
                  trimmedNick && !nickIsValid
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-slate-200 focus:border-red-600'
                }`}
              />
              {trimmedNick && !nickIsValid && (
                <p className="text-[10px] text-red-600 mt-1">
                  Use apenas letras sem acento, números e - = ? ! @ : . , (máx. 15 caracteres).
                </p>
              )}
            </div>

            {/* Pré-visualização do Avatar ao digitar */}
            {trimmedNick && nickIsValid && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 overflow-hidden shrink-0">
                  <AvatarImg src={getAvatarUrl(trimmedNick)} alt="Avatar Preview" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">Avatar Detetado</p>
                  <p className="text-[10px] text-slate-500">A imagem será associada ao nick.</p>
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Palavra-passe (Senha)</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Cargo / Permissão</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-red-600 text-slate-800 font-medium"
              >
                <option value="DESENVOLVEDOR">Desenvolvedor</option>
                <option value="WEBMASTER">Webmaster</option>
                <option value="DIRETOR">Diretor</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="COORDENADOR">Coordenador</option>
                <option value="JORNALISTA">Jornalista</option>
                <option value="PROMOTOR">Promotor</option>
                <option value="LOCUTOR">Locutor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting || !nickIsValid}
              className="w-full bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-800 transition-colors shadow-md shadow-red-700/20 disabled:opacity-50"
            >
              {submitting ? 'A criar...' : 'Criar Utilizador'}
            </button>
          </form>
        </div>

        {/* Lista de Contas Existentes */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 px-1">
            Utilizadores Registados
          </h3>

          {loading ? (
            <p className="text-xs text-slate-400">A carregar utilizadores...</p>
          ) : users.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 shadow-sm">
              Nenhum utilizador registado.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar do utilizador na lista (usa o salvo no banco, se existir) */}
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <AvatarImg
                        src={user.avatar || getAvatarUrl(user.username)}
                        alt={user.username}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{user.username}</h4>
                        <span className="px-2 py-0.5 bg-red-50 text-red-700 font-bold text-[10px] rounded-md uppercase">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Criado a {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {user.username !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                        title="Apagar utilizador"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}