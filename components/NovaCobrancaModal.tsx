"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

export function NovaCobrancaModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const cliente_nome = formData.get("nome") as string;
    const valor = parseFloat(formData.get("valor") as string);
    const vencimento = formData.get("vencimento") as string;

    // Inserimos a cobrança JUNTAMENTE com o user_id de quem a criou
    const { error } = await supabase
      .from("cobrancas")
      .insert([{ user_id: userId, cliente_nome, valor, vencimento, status: "aguardando" }]);

    setLoading(false);

    if (!error) {
      setOpen(false);
      router.refresh();
    } else {
      alert("Erro ao criar a cobrança: " + error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-700">
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
          <Button type="submit" className="w-full text-black bg-white hover:bg-zinc-200" disabled={loading}>
            {loading ? "Salvando..." : "Criar Cobrança"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}