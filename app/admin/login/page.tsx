'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('DEBUG [1]: Botão clicado. Iniciando envio do formulário...');
    setLoading(true);
    setError('');

    try {
      console.log('DEBUG [2]: A fazer fetch para /api/auth/login com:', { username });
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('DEBUG [3]: Resposta recebida da API. Status:', res.status, 'Dados:', data);

      if (res.ok) {
        console.log('DEBUG [4]: Login OK! A redirecionar para /admin com window.location...');
        window.location.href = '/admin';
      } else {
        console.log('DEBUG [4-Erro]: API retornou erro:', data.error);
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('DEBUG [Catch]: Erro crítico na requisição fetch:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      console.log('DEBUG [5]: Finalizando requisição, tirando o loading.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-700 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-red-700/20 font-black">
            BR
          </div>
          <h1 className="text-lg font-black text-gray-900">Painel BletRed</h1>
          <p className="text-xs text-gray-400">Entre para acessar sua área e os avisos oficiais.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Usuário / Nick</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-red-600"
                placeholder="Ex: admin"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-1">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-red-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-red-700/20 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>

        <div className="bg-gray-50 p-3 rounded-xl text-[11px] text-gray-500 text-center space-y-1">
          <p className="font-semibold">Acesso Admin padrão:</p>
          <p>Usuário: <code className="text-red-600 font-bold">admin</code> | Senha: <code className="text-red-600 font-bold">admin123</code></p>
        </div>
      </div>
    </div>
  );
}