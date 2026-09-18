import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Cobranças</h1>
            <p className="text-zinc-500 mt-1">Gerencie seus links Pix e lembretes.</p>
          </div>
          <Button>+ Nova Cobrança Pix</Button>
        </div>

        {/* Cartão de Lista de Cobranças */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Cobranças</CardTitle>
            <CardDescription>Acompanhe o status dos pagamentos dos seus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              
              {/* Exemplo de Cobrança 1 */}
              <div className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm">
                <div>
                  <p className="font-medium text-zinc-900">João Silva - Consulta</p>
                  <p className="text-sm text-zinc-500">Vencimento: Hoje</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <p className="font-bold text-zinc-900">R$ 150,00</p>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    Aguardando Pix
                  </span>
                </div>
              </div>

              {/* Exemplo de Cobrança 2 */}
              <div className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm">
                <div>
                  <p className="font-medium text-zinc-900">Maria Oliveira - Mensalidade</p>
                  <p className="text-sm text-zinc-500">Vencimento: 15/09/2026</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <p className="font-bold text-zinc-900">R$ 300,00</p>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-800 rounded-full">
                    Pago
                  </span>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}