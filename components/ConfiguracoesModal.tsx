"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"

export function ConfiguracoesModal({ configAtual }: { configAtual: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // O UPSERT garante que cria a linha 1 se ela não existir
    const { error } = await supabase.from('configuracoes').upsert({
      id: 1,
      chave_pix: formData.get('chave_pix'),
      nome_titular: formData.get('nome_titular'),
      cidade: formData.get('cidade')
    })

    setLoading(false)

    if (error) {
      alert("Erro ao guardar: " + error.message)
    } else {
      setOpen(false)
      alert("Configurações atualizadas com sucesso!") // Alerta para confirmar
      router.refresh() // Manda o Next.js recarregar a tela
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100">
        ⚙️ Configurações
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Dados do Pix</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Chave Pix</Label>
            <Input name="chave_pix" defaultValue={configAtual?.chave_pix} required placeholder="Ex: +5511999999999 ou CPF" />
          </div>
          <div className="space-y-2">
            <Label>Nome do Titular (Sem acentos)</Label>
            <Input name="nome_titular" defaultValue={configAtual?.nome_titular} required placeholder="Ex: Kaua Vieira" />
          </div>
          <div className="space-y-2">
            <Label>Cidade (Sem acentos)</Label>
            <Input name="cidade" defaultValue={configAtual?.cidade} required placeholder="Ex: Goiania" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "A guardar..." : "Guardar Configurações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}