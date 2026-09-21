"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QRCodeCanvas } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { QrCodePix } from "qrcode-pix"

interface BotaoCobrarPixProps {
  cobranca: {
    id: string
    cliente_nome: string
    valor: number
  }
  configuracao: any // Variável que recebe do banco
}

export function BotaoCobrarPix({ cobranca, configuracao }: BotaoCobrarPixProps) {
  
  // Puxa os dados da configuracao. Se não existir, avisa no código gerado.
  const chavePix = configuracao?.chave_pix || 'CHAVE_NAO_CONFIGURADA'
  const nomeTitular = configuracao?.nome_titular || 'NOME_NAO_CONFIGURADO'
  const cidadeTitular = configuracao?.cidade || 'CIDADE_NAO_CONFIGURADA'

  const pix = QrCodePix({
    version: '01',
    key: chavePix,
    name: nomeTitular,
    city: cidadeTitular,
    transactionId: '***',
    message: 'Cobranca ' + cobranca.cliente_nome,
    value: cobranca.valor,
  });

  const payloadPixReal = pix.payload();
  const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cobranca.valor);
  const mensagemWhatsApp = `Olá, ${cobranca.cliente_nome}! 👋\n\nAqui está o link para o pagamento do seu serviço no valor de *${valorFormatado}*.\n\nVocê pode escanear o QR Code ou usar o recurso "Pix Copia e Cola" no seu aplicativo de banco com o código abaixo:\n\n${payloadPixReal}\n\nQualquer dúvida, estou à disposição!`;

  const copiarPix = () => {
    navigator.clipboard.writeText(payloadPixReal)
    alert("Código Pix copiado!")
  }

  const copiarMensagemWhatsApp = () => {
    navigator.clipboard.writeText(mensagemWhatsApp)
    alert("Mensagem para WhatsApp copiada!")
  }

  const copiarImagemQR = () => {
    const canvas = document.getElementById("qr-code-pix") as HTMLCanvasElement
    if (!canvas) return

    const borda = 28
    const canvasComBorda = document.createElement("canvas")
    canvasComBorda.width = canvas.width + borda * 2
    canvasComBorda.height = canvas.height + borda * 2

    const contexto = canvasComBorda.getContext("2d")
    if (!contexto) return

    contexto.fillStyle = "#FFFFFF"
    contexto.fillRect(0, 0, canvasComBorda.width, canvasComBorda.height)
    contexto.drawImage(canvas, borda, borda)

    canvasComBorda.toBlob((blob) => {
      if (!blob) return
      const item = new ClipboardItem({ "image/png": blob })
      navigator.clipboard.write([item])
        .then(() => alert("Imagem do QR Code copiada! Agora é só colar (Ctrl+V) no WhatsApp."))
        .catch(() => alert("Seu navegador bloqueou a cópia direta. Clique com o botão direito no QR Code e selecione 'Copiar imagem'."))
    }, "image/png")
  }

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-zinc-200">
        Ver Pix
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-center max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Cobrança: {cobranca.cliente_nome}</DialogTitle>
          <DialogDescription className="text-center">Compartilhe o código abaixo com o seu cliente.</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-xl bg-white border-[6px] border-white shadow-sm">
              <QRCodeCanvas id="qr-code-pix" value={payloadPixReal} size={200} bgColor="#FFFFFF" fgColor="#000000" includeMargin={true} />
            </div>
            <Button onClick={copiarImagemQR} variant="outline" size="sm" className="text-xs">Copiar Imagem do QR Code</Button>
          </div>
          
          <div className="w-full space-y-4 text-left">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700">Pix Copia e Cola (Apenas o código):</p>
              <div className="flex gap-2">
                <Input readOnly value={payloadPixReal} className="text-xs" />
                <Button onClick={copiarPix} variant="secondary">Copiar</Button>
              </div>
            </div>
            <hr className="my-2" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700">Mensagem pronta para WhatsApp:</p>
              <div className="p-3 bg-zinc-50 rounded-md border text-xs text-zinc-600 whitespace-pre-wrap break-all text-left">
                {mensagemWhatsApp}
              </div>
              <Button onClick={copiarMensagemWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white">Copiar Mensagem Padrão</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}