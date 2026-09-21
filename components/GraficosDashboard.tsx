"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"

export function GraficosDashboard({ cobrancas }: { cobrancas: any[] }) {
  const pagos = cobrancas.filter(c => c.status === 'pago').length;
  const aguardando = cobrancas.filter(c => c.status === 'aguardando').length;
  
  const dadosStatus = [
    { name: 'Recebido', value: pagos, color: '#10b981' }, 
    { name: 'Pendente', value: aguardando, color: '#52525b' } 
  ];

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const dadosMensais = meses.map(mes => ({ name: mes, recebido: 0, pendente: 0 }));

  cobrancas.forEach(c => {
    if (!c.vencimento) return;
    const mesIndex = new Date(c.vencimento + "T12:00:00Z").getMonth();
    if (c.status === 'pago') {
      dadosMensais[mesIndex].recebido += c.valor;
    } else {
      dadosMensais[mesIndex].pendente += c.valor;
    }
  });

  const mesAtual = new Date().getMonth();
  const ultimos7Meses = [];
  for (let i = 6; i >= 0; i--) {
    let index = mesAtual - i;
    if (index < 0) index += 12; 
    ultimos7Meses.push(dadosMensais[index]);
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      <div className="lg:col-span-2 rounded-xl border border-zinc-800/60 bg-[#121214] p-5 min-h-[300px] flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-semibold text-sm text-zinc-100">Fluxo de caixa</h3>
            <p className="text-xs text-zinc-400">Últimos 7 meses</p>
          </div>
          <div className="flex gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Recebido</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-600"></div> Pendente</span>
          </div>
        </div>
        <div className="flex-1 w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ultimos7Meses} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', padding: '12px' }}
                itemStyle={{ fontSize: '13px', paddingTop: '4px' }}
                labelStyle={{ color: '#a1a1aa', fontSize: '13px', fontWeight: 600, paddingBottom: '6px', borderBottom: '1px solid #27272a', marginBottom: '4px' }}
                labelFormatter={(label: any) => {
                  const mesesCompletos: Record<string, string> = {
                    'Jan': 'Janeiro', 'Fev': 'Fevereiro', 'Mar': 'Março', 'Abr': 'Abril',
                    'Mai': 'Maio', 'Jun': 'Junho', 'Jul': 'Julho', 'Ago': 'Agosto',
                    'Set': 'Setembro', 'Out': 'Outubro', 'Nov': 'Novembro', 'Dez': 'Dezembro'
                  };
                  return mesesCompletos[String(label)] || label;
                }}
                formatter={(value: any, name: any) => {
                  const nomeFormatado = name === 'recebido' ? 'Recebido' : 'Pendente';
                  return [formatarMoeda(Number(value)), nomeFormatado];
                }}
              />
              <Line type="monotone" dataKey="recebido" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pendente" stroke="#52525b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-[#121214] p-5 min-h-[300px] flex flex-col">
        <h3 className="font-semibold text-sm text-zinc-100 mb-1">Status das Cobranças</h3>
        <p className="text-xs text-zinc-400 mb-6">Proporção atual</p>
        <div className="flex-1 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dadosStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {dadosStatus.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ fontSize: '13px', color: '#f4f4f5' }}
                formatter={(value: any) => [`${value} cobrança(s)`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-zinc-400 block">Total</span>
            <span className="text-sm font-bold text-zinc-100">{cobrancas.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}