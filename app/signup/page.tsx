"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setSucesso("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validação para garantir que as senhas são iguais
    if (password !== confirmPassword) {
      setErro("As senhas não coincidem. Tente novamente.");
      setCarregando(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErro(error.message);
      setCarregando(false);
    } else {
      setSucesso("Conta criada com sucesso! A redirecionar...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md rounded-xl border border-zinc-800/60 bg-[#121214] p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center text-lg font-bold mb-4">F</div>
          <h1 className="text-2xl font-semibold text-white">Criar Conta</h1>
          <p className="text-sm text-zinc-400 mt-2">Registe-se para gerir as suas cobranças</p>
        </div>

        <form onSubmit={onSignup} className="space-y-4">
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
            <label className="block text-sm font-medium text-zinc-400 mb-1">Senha</label>
            <input 
              type="password" 
              name="password" 
              required
              minLength={6}
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Confirmar Senha</label>
            <input 
              type="password" 
              name="confirmPassword" 
              required
              minLength={6}
              className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Repita a senha"
            />
          </div>

          {erro && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="text-emerald-400 text-sm text-center bg-emerald-400/10 py-2 rounded-lg border border-emerald-400/20">
              {sucesso}
            </p>
          )}

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-white text-black font-semibold rounded-lg px-4 py-2.5 hover:bg-zinc-200 transition-colors mt-4 disabled:opacity-50"
          >
            {carregando ? "A criar conta..." : "Registar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-zinc-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-white font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}