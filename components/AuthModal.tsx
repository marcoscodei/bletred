'use client';

import React, { useEffect, useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';

const LOGIN_URL = '/api/auth/community-login';
const REGISTER_URL = '/api/auth/community-register'; // confirme o nome da pasta

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: (user: any) => void;
}

const postJson = async (url: string, body: unknown) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Rota não encontrada ou erro no servidor (${res.status}): ${url}`);
  }

  if (!res.ok) throw new Error(data.error || 'Erro na requisição.');
  return data;
};

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await postJson(REGISTER_URL, { username, password });
      }

      // Depois de registar, faz login automático
      const user = await postJson(LOGIN_URL, { username, password });

      setUsername('');
      setPassword('');
      onSuccess?.(user);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-indigo-950/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl shadow-violet-900/30 w-full max-w-sm p-6 relative overflow-hidden border border-violet-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Faixa e brilhos de galáxia no topo */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500"></div>
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-violet-400/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -top-10 -left-16 w-36 h-36 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-violet-600 cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        <div className="relative">
          <h2 className="text-lg font-extrabold text-gray-900 mb-1">
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            {mode === 'login'
              ? 'Use o seu nick e senha para entrar.'
              : 'Escolha o seu nick e uma senha.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nick"
              maxLength={15}
              required
              className="w-full bg-violet-50/60 border border-violet-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="w-full bg-violet-50/60 border border-violet-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
            />

            {/* Erro mantém vermelho para continuar legível como alerta */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-violet-600/20 cursor-pointer"
            >
              {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Registar'}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="mt-4 w-full text-center text-xs text-gray-500 hover:text-violet-600 cursor-pointer"
          >
            {mode === 'login' ? 'Não tem conta? Registe-se' : 'Já tem conta? Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
};