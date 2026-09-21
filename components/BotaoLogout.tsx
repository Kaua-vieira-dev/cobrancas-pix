import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export function BotaoLogout() {
  const logout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <form action={logout}>
      <button 
        type="submit" 
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors cursor-pointer"
      >
        <span className="opacity-70">↪</span> Encerrar Sessão
      </button>
    </form>
  );
}