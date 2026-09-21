"use client"; // Indica que esse componente roda no navegador (Client-side)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { supabase } from "@/src/lib/supabase";

export function NovaCobrancaModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    // Pega os dados que o usuário digitou no formulário
    const formData = new FormData(event.currentTarget);
    const cliente_nome = formData.get("nome") as string;
    const valor = parseFloat(formData.get("valor") as string);
    const vencimento = formData.get("vencimento") as string;

    // Envia para o Supabase
    const { error } = await supabase
      .from("cobrancas")
      .insert([{ cliente_nome, valor, vencimento, status: "aguardando" }]);

    setLoading(false);

    if (!error) {
      setOpen(false); // Fecha a janelinha
      router.refresh(); // Manda a tela inicial buscar os dados atualizados
    } else {
      alert("Erro ao criar a cobrança. Tente novamente.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow hover:bg-zinc-900/90">
        + Nova Cobrança Pix
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Cobrança</DialogTitle>
          <DialogDescription>
            Crie um novo link de pagamento para o seu cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cliente</Label>
            <Input
              id="nome"
              name="nome"
              required
              placeholder="Ex: Maria Oliveira"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              name="valor"
              type="number"
              step="0.01"
              required
              placeholder="Ex: 150.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vencimento">Data de Vencimento</Label>
            <Input id="vencimento" name="vencimento" type="date" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Criar Cobrança"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
