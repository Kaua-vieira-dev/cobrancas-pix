"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  // Criamos a ligação ao Supabase DIRETAMENTE no navegador (100% à prova de falhas)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Tenta fazer o login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Força a exibição do erro exato na tela
      setErro(error.message === "Invalid login credentials" ? "Email ou palavra-passe incorretos." : error.message);
      setCarregando(false);
    } else {
      // Sucesso! Atualiza o router e vai para o painel principal
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md rounded-xl border border-zinc-800/60 bg-[#121214] p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center text-lg font-bold mb-4">F</div>
          <h1 className="text-2xl font-semibold text-white">Bem-vindo ao Fluxo</h1>
          <p className="text-sm text-zinc-400 mt-2">Faça login para gerir as suas cobranças</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Palavra-passe</label>
            <input 
              type="password" 
              name="password" 
              required
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
              {erro}
            </p>
          )}

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-white text-black font-semibold rounded-lg px-4 py-2.5 hover:bg-zinc-200 transition-colors mt-4 disabled:opacity-50"
          >
            {carregando ? "A verificar..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}