// app/page.js
'use client'; // Indica que este componente será renderizado no cliente

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importe do 'next/navigation' para o App Router
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Utilizador já está logado, redirecionar para a página principal
        router.push('app');
      } else {
        // Nenhum utilizador logado, manter na página de login
        setLoading(false);
      }
    });

    // Limpar o listener ao desmontar o componente
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O listener onAuthStateChanged cuidará do redirecionamento após o login
    } catch (authError) {
      let errorMessage = 'Falha ao fazer login.';
      if (authError.code === 'auth/user-not-found') {
        errorMessage = 'Utilizador não encontrado.';
      } else if (authError.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else {
        errorMessage = `Erro de autenticação: ${authError.message}`;
      }
      setError(errorMessage);
      setLoading(false);
      console.error('Erro de autenticação:', authError);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="text-center text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Esqueceu a senha?
            </a>
          </div>
          {error && (
            <p className="text-red-500 text-xs italic mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}