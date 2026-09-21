"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"

export function ConfiguracoesModal({ configAtual, userId }: { configAtual: any, userId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const chave_pix = formData.get('chave_pix')
    const nome_titular = formData.get('nome_titular')
    const cidade = formData.get('cidade')

    let error;

    // Se já existe configuração, faz um UPDATE. Se não, faz um INSERT com o user_id.
    if (configAtual?.id) {
      const { error: updateError } = await supabase.from('configuracoes').update({
        chave_pix,
        nome_titular,
        cidade
      }).eq('id', configAtual.id)
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('configuracoes').insert({
        user_id: userId,
        chave_pix,
        nome_titular,
        cidade
      })
      error = insertError;
    }

    setLoading(false)

    if (error) {
      alert("Erro ao guardar: " + error.message)
    } else {
      setOpen(false)
      alert("Configurações atualizadas com sucesso!")
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100">
        ⚙️ <span className="hidden sm:inline ml-2">Configurações</span><span className="sm:hidden ml-2">Config</span>
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
          <Button type="submit" className="w-full text-black bg-white hover:bg-zinc-200" disabled={loading}>
            {loading ? "A guardar..." : "Guardar Configurações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}