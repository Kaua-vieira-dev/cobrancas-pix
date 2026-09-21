"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { supabase } from "@/src/lib/supabase";

export function BotoesAcao({
  cobrancaId,
  statusAtual,
}: {
  cobrancaId: string;
  statusAtual: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Função para mudar de 'aguardando' para 'pago' (e vice-versa)
  const alternarStatus = async () => {
    setLoading(true);
    const novoStatus = statusAtual === "aguardando" ? "pago" : "aguardando";

    await supabase
      .from("cobrancas")
      .update({ status: novoStatus })
      .eq("id", cobrancaId);

    setLoading(false);
    router.refresh(); // Manda o Next.js atualizar a lista na tela
  };

  // Função para apagar a cobrança do banco de dados
  const excluir = async () => {
    // Pede uma confirmação simples para evitar cliques acidentais
    if (window.confirm("Tem a certeza que deseja excluir esta cobrança?")) {
      setLoading(true);

      await supabase.from("cobrancas").delete().eq("id", cobrancaId);

      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={statusAtual === "aguardando" ? "outline" : "secondary"}
        size="sm"
        onClick={alternarStatus}
        disabled={loading}
        className="h-8 text-xs"
      >
        {statusAtual === "aguardando" ? "✅ Marcar Pago" : "⏳ Desfazer"}
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={excluir}
        disabled={loading}
        className="h-8 text-xs bg-red-500 hover:bg-red-600 text-black"
      >
        🗑️ Excluir
      </Button>
    </div>
  );
}
