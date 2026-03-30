import React, { useState, useEffect } from "react";
import { Users, AlertCircle, Clock, GraduationCap, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Contract } from "../types";

export const Dashboard = ({ currentContract }: { currentContract: Contract }) => {
  const [stats, setStats] = useState<any>(null);
  const [selectedList, setSelectedList] = useState<{ type: string, title: string, data: any[] } | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    fetch(`/api/dashboard?contrato=${currentContract}`).then(res => res.json()).then(setStats);
  }, [currentContract]);

  const handleCardClick = (type: string, title: string) => {
    if (stats.listas && stats.listas[type]) {
      setSelectedList({ type, title, data: stats.listas[type] });
    }
  };

  if (!stats) return <div className="p-8 text-slate-400">Carregando indicadores...</div>;

  const cards = [
    { id: "totalFuncionarios", label: "Total Funcionários", value: stats.totalFuncionarios, icon: Users, color: "text-accent" },
    { id: "asosVencidos", label: "ASO Vencidos", value: stats.asosVencidos, icon: AlertCircle, color: "text-danger" },
    { id: "semEscala", label: "Sem Escala Ativa", value: stats.semEscala, icon: Clock, color: "text-accent" },
    { id: "treinamentosPendentes", label: "Treinamentos Pendentes", value: stats.treinamentosPendentes, icon: GraduationCap, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const isClickable = card.id !== "totalFuncionarios";
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card flex items-center justify-between transition-all group ${isClickable ? 'cursor-pointer hover:border-accent' : 'cursor-default'}`}
              onClick={() => isClickable && handleCardClick(card.id, card.label)}
            >
              <div>
                <p className={`text-[11px] font-bold text-hint uppercase tracking-widest font-mono transition-colors ${isClickable ? 'group-hover:text-accent' : ''}`}>{card.label}</p>
                <p className="text-3xl font-bold mt-2 text-text">{card.value}</p>
              </div>
              <card.icon className={`w-10 h-10 opacity-10 ${card.color} ${isClickable ? 'group-hover:opacity-40' : ''} transition-opacity`} />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-sm font-bold text-text uppercase pb-4 mb-6 border-b border-border font-mono">Atividades Recentes</h3>
          <div className="space-y-4">
            {stats.atividades && stats.atividades.length > 0 ? (
              stats.atividades.map((atv: any, i: number) => (
                <div key={i} className="flex items-center gap-4 text-sm p-3 hover:bg-surface2 transition-colors border-b border-border last:border-0">
                  <div className={`w-2 h-2 ${atv.tipo === 'treinamento' ? 'bg-success' : 'bg-accent'}`} />
                  <span className="text-muted font-medium">{atv.texto}</span>
                  <span className="ml-auto text-[10px] text-hint font-bold uppercase font-mono">{atv.tempo}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-hint italic p-4 text-center font-mono">Nenhuma atividade recente registrada.</p>
            )}
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-bold text-text uppercase pb-4 mb-6 border-b border-border font-mono">Alertas Críticos</h3>
          <div className="space-y-4">
            {stats.alertas && stats.alertas.length > 0 ? (
              stats.alertas.map((alerta: any, i: number) => (
                <div key={i} className={`flex items-center gap-4 text-sm p-4 border ${
                  alerta.tipo === 'erro' ? 'bg-accent-light text-danger border-danger/20' : 'bg-surface2 text-text border-border'
                }`}>
                  {alerta.tipo === 'erro' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  <span className="font-bold uppercase tracking-tight font-mono">{alerta.texto}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-4 text-sm p-4 bg-[#F0FDF4] text-success border border-success/20">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold uppercase tracking-tight font-mono">Tudo em dia! Nenhum alerta crítico no momento.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedList && (
          <div className="fixed inset-0 bg-text/80 flex items-center justify-center z-[60] p-8 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-surface shadow-2xl w-full max-w-5xl flex flex-col max-h-[85vh]"
            >
              <div className="bg-text p-5 text-white flex justify-between items-center">
                <h3 className="text-lg font-bold uppercase tracking-widest font-mono">{selectedList.title}</h3>
                <button onClick={() => setSelectedList(null)} className="hover:bg-white/10 p-2 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Matrícula</th>
                      <th>Nome</th>
                      <th>Cargo / Setor</th>
                      <th>Status</th>
                      <th>Info Adicional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedList.data.map((f: any) => (
                      <tr key={f.id}>
                        <td className="font-mono text-xs font-bold">{f.matricula}</td>
                        <td className="font-bold">{f.nome}</td>
                        <td>
                          <div className="text-xs font-bold text-muted uppercase font-mono">{f.cargo}</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            (f.status === 'Ativo' || !f.status) ? 'badge-success' : 'bg-accent-light text-accent'
                          }`}>
                            {f.status || "Ativo"}
                          </span>
                        </td>
                        <td className="font-mono text-xs font-bold text-accent uppercase">
                          {f.info_adicional || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
