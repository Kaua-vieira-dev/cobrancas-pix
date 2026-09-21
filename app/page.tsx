import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { NovaCobrancaModal } from "@/components/NovaCobrancaModal";
import { BotaoCobrarPix } from "@/components/BotaoCobrarPix";
import { ConfiguracoesModal } from "@/components/ConfiguracoesModal";
import { BotoesAcao } from "@/components/BotoesAcao";

export const revalidate = 0;

export default async function Page() {
  // Busca os dados no Supabase
  const { data: cobrancas } = await supabase
    .from("cobrancas")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: configuracao } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("id", 1)
    .single();

  // Cálculos para as Métricas
  const totalRecebido = cobrancas?.filter(c => c.status === 'pago').reduce((acc, curr) => acc + curr.valor, 0) || 0;
  const totalPendente = cobrancas?.filter(c => c.status === 'aguardando').reduce((acc, curr) => acc + curr.valor, 0) || 0;
  const totalGeral = totalRecebido + totalPendente;
  const quantidadeCobrancas = cobrancas?.length || 0;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  const formatarData = (dataStr: string) => {
    return new Date(dataStr + "T12:00:00Z").toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' });
  };

  // Mês atual para o cabeçalho (ex: Setembro de 2026)
  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const mesCapitalizado = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
      
      {/* BARRA LATERAL (Sidebar) */}
      <aside className="w-64 border-r border-zinc-800/60 bg-[#0f0f11] flex-col hidden md:flex">
        <div className="flex h-20 items-center px-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-6 h-6 bg-white text-black rounded-md flex items-center justify-center text-xs">F</div>
            Fluxo
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-zinc-800/60 px-3 py-2.5 text-sm font-medium text-white">
            <span className="opacity-70">⊞</span> Visão geral
          </div>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 transition-colors cursor-pointer">
            <span className="opacity-70">⇆</span> Transações
          </div>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 transition-colors cursor-pointer">
            <span className="opacity-70">◐</span> Relatórios
          </div>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 transition-colors cursor-pointer">
            <span className="opacity-70">📄</span> Contas
          </div>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* CABEÇALHO */}
        <header className="flex h-20 items-center justify-between border-b border-zinc-800/60 px-8">
          <div>
            <h1 className="text-xl font-semibold">Visão geral</h1>
            <p className="text-sm text-zinc-400 mt-0.5">{mesCapitalizado} · Conta principal</p>
          </div>
          <div className="flex items-center gap-4">
            <ConfiguracoesModal configAtual={configuracao} />
            <NovaCobrancaModal />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 space-y-6">
          
          {/* BLOCO DE MÉTRICAS UNIFICADO */}
          <div className="grid grid-cols-1 md:grid-cols-4 rounded-xl border border-zinc-800/60 bg-[#121214] divide-y md:divide-y-0 md:divide-x divide-zinc-800/60">
            {/* Card 1 */}
            <div className="p-5 flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                <span className="text-sm text-zinc-400">Volume Total</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatarMoeda(totalGeral)}</div>
                <div className="text-xs text-zinc-500 mt-1">Neste mês</div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="p-5 flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                <span className="text-sm text-zinc-400">Recebido</span>
                <span className="text-xs text-emerald-400 flex items-center gap-1">↗ Pago</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatarMoeda(totalRecebido)}</div>
                <div className="text-xs text-zinc-500 mt-1">já em conta</div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="p-5 flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                <span className="text-sm text-zinc-400">Pendente</span>
                <span className="text-xs text-red-400 flex items-center gap-1">↘ Atrasado/Aguardando</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatarMoeda(totalPendente)}</div>
                <div className="text-xs text-zinc-500 mt-1">a receber</div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="p-5 flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                <span className="text-sm text-zinc-400">Cobranças Ativas</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{quantidadeCobrancas}</div>
                <div className="text-xs text-zinc-500 mt-1">registros totais</div>
              </div>
            </div>
          </div>

          {/* ÁREA DOS GRÁFICOS */}
          <GraficosDashboard cobrancas={cobrancas || []} />

          {/* LISTA DE TRANSAÇÕES RECENTES */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Transações recentes</h3>
                <p className="text-sm text-zinc-400">Movimentações de cobrança</p>
              </div>
              <span className="text-sm text-zinc-400 hover:text-white cursor-pointer">Ver tudo</span>
            </div>
            
            <div className="rounded-xl border border-zinc-800/60 bg-[#121214] overflow-hidden">
              <div className="flex flex-col">
                {!cobrancas || cobrancas.length === 0 ? (
                  <p className="text-center text-zinc-500 py-8 text-sm">Nenhuma cobrança cadastrada.</p>
                ) : (
                  cobrancas.map((cobranca, index) => (
                    <div
                      key={cobranca.id}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 ${
                        index !== cobrancas.length - 1 ? 'border-b border-zinc-800/60' : ''
                      } hover:bg-zinc-800/20 transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800/80`}>
                          <span className="text-sm font-medium">{cobranca.cliente_nome.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-zinc-100">{cobranca.cliente_nome}</p>
                          <p className="text-xs text-zinc-500">
                            Vence em: {formatarData(cobranca.vencimento)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-sm text-zinc-100">{formatarMoeda(cobranca.valor)}</p>
                          <p className={`text-xs ${cobranca.status === "pago" ? "text-emerald-400" : "text-yellow-500"}`}>
                            {cobranca.status === "pago" ? "Pagamento concluído" : "Aguardando pagamento"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <BotoesAcao cobrancaId={cobranca.id} statusAtual={cobranca.status} />
                          <BotaoCobrarPix cobranca={cobranca} configuracao={configuracao} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}