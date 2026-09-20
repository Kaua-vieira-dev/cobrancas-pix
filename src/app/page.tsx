import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { supabase } from "@/src/lib/supabase";
import { NovaCobrancaModal } from "@/src/components/NovaCobrancaModal";
import { BotaoCobrarPix } from "@/src/components/BotaoCobrarPix";
import { ConfiguracoesModal } from "@/src/components/ConfiguracoesModal";
import { BotoesAcao } from "@/src/components/BotoesAcao";

// Força o Next.js a sempre buscar dados novos ao recarregar a página
export const revalidate = 0;

export default async function Home() {
  // Fazendo a busca no banco de dados (tabela 'cobrancas')
  const { data: cobrancas } = await supabase
    .from("cobrancas")
    .select("*")
    .order("created_at", { ascending: false });

  // Fazendo a busca da configuração do Pix (tabela 'configuracoes')
  const { data: configuracao } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("id", 1)
    .single();

  // Funções para deixar a data e o dinheiro no formato brasileiro
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };
  const formatarData = (dataStr: string) => {
    // Como o vencimento vem como 'YYYY-MM-DD', adicionamos um horário fixo para evitar erro de fuso horário
    return new Date(dataStr + "T12:00:00Z").toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Cobranças</h1>
            <p className="text-zinc-500 mt-1">
              Gerencie seus links Pix e lembretes.
            </p>
          </div>
          {/* Botões do topo agrupados */}
          <div className="flex gap-3">
            <ConfiguracoesModal configAtual={configuracao} />
            <NovaCobrancaModal />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Cobranças</CardTitle>
            <CardDescription>
              Acompanhe o status dos pagamentos dos seus clientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Se não tiver cobranças, mostra uma mensagem. Se tiver, cria a lista (map) */}
              {!cobrancas || cobrancas.length === 0 ? (
                <p className="text-center text-zinc-500 py-4">
                  Nenhuma cobrança cadastrada ainda.
                </p>
              ) : (
                cobrancas.map((cobranca) => (
                  <div
                    key={cobranca.id}
                    className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">
                        {cobranca.cliente_nome}
                      </p>
                      <p className="text-sm text-zinc-500">
                        Vencimento: {formatarData(cobranca.vencimento)}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-zinc-900">
                          {formatarMoeda(cobranca.valor)}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            cobranca.status === "pago"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {cobranca.status.toUpperCase()}
                        </span>
                      </div>

                      {/* O botão do Pix agora recebe a configuração também */}
                      <BotaoCobrarPix cobranca={cobranca} configuracao={configuracao} />
                      <div className="text-right flex flex-col items-end gap-3">
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-zinc-900">
                          {formatarMoeda(cobranca.valor)}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            cobranca.status === "pago"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {cobranca.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Agrupamos os botões de ação com o botão de Ver Pix */}
                      <div className="flex items-center gap-2">
                        <BotoesAcao cobrancaId={cobranca.id} statusAtual={cobranca.status} />
                        <BotaoCobrarPix cobranca={cobranca} configuracao={configuracao} />
                      </div>
                    </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}