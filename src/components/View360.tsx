import React, { useState, useEffect } from "react";
import { 
  LogOut, 
  User, 
  Calendar, 
  ShieldCheck, 
  GraduationCap, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  IdCard, 
  Hash, 
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

export const View360 = ({ id, onClose, initialData }: { id: number, onClose: () => void, initialData?: any }) => {
  const [data, setData] = useState<any>(initialData ? { funcionario: initialData, rh: null, treinamentos: [] } : null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // If we have initialData, we only need to fetch the extra details
    // but the API currently returns everything. 
    // We'll fetch and update the state.
    fetch(`/api/funcionarios/${id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"
      />

      {/* Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.02 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-nexus-bg w-full h-full shadow-2xl flex flex-col overflow-hidden"
      >
        {!data && loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-nexus-primary" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Sincronizando Dados 360°...</p>
          </div>
        ) : data && (
          <>
            {/* Header Section */}
            <div className="bg-nexus-sidebar p-8 text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-3xl" />
              
              <div className="relative flex justify-between items-start">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center text-4xl font-black border border-white/20 shadow-2xl backdrop-blur-md">
                      {data.funcionario.nome.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-nexus-sidebar rounded-full flex items-center justify-center shadow-lg" title="Ativo">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-3xl font-black tracking-tight">{data.funcionario.nome}</h2>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                        Matrícula {data.funcionario.matricula}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-nexus-primary" />
                      {data.funcionario.cargo} <span className="text-white/20">•</span> {data.funcionario.setor}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-3 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/20 group"
                >
                  <LogOut className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar Info */}
              <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto p-8 space-y-10 shrink-0">
                <section>
                  <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em] flex items-center gap-2">
                    <IdCard className="w-3.5 h-3.5 text-nexus-primary" /> Identificação
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-nexus-primary/30 hover:bg-white transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1">
                        <Hash className="w-[15px] h-[15px] text-slate-400 group-hover:text-nexus-primary transition-colors" />
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">CPF</p>
                      </div>
                      <p className="text-[15px] font-mono font-bold text-slate-700 pl-6.5" style={{ fontFamily: 'system-ui' }}>{data.funcionario.cpf}</p>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-nexus-primary/30 hover:bg-white transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1">
                        <IdCard className="w-[15px] h-[15px] text-slate-400 group-hover:text-nexus-primary transition-colors" />
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">RG</p>
                      </div>
                      <p className="text-[15px] font-mono font-bold text-slate-700 pl-6.5" style={{ fontFamily: 'system-ui' }}>{data.funcionario.rg || 'N/A'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-nexus-primary/30 hover:bg-white transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1">
                        <Calendar className="w-[15px] h-[15px] text-slate-400 group-hover:text-nexus-primary transition-colors" />
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Nascimento</p>
                      </div>
                      <p className="text-[15px] font-bold text-slate-700 pl-6.5" style={{ fontFamily: 'system-ui' }}>
                        {data.funcionario.data_nascimento ? new Date(data.funcionario.data_nascimento).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em] flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-nexus-primary" /> Contato Direto
                  </h3>
                  {!data.rh && loading ? (
                    <div className="py-10 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-200 mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">E-mail Corporativo</p>
                          <p className="text-xs font-bold text-slate-700 truncate">{data.rh?.email || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Telefone / WhatsApp</p>
                          <p className="text-xs font-bold text-slate-700">{data.rh?.telefone || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors mt-1">
                          <MapPin className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Residência</p>
                          <p className="text-xs font-bold text-slate-700 leading-relaxed">{data.rh?.endereco || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Main Modules */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {loading && data.treinamentos.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Treinamentos Module */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase text-slate-600 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-nexus-primary" /> Treinamentos & Qualificações
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                          {data.treinamentos.length} Registros
                        </span>
                      </div>
                      <div className="p-5 space-y-4">
                        {data.treinamentos.map((t: any, i: number) => (
                          <div key={i} className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-nexus-primary/30 hover:bg-nexus-primary/5 transition-all">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              t.status === 'Aprovado' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {t.status === 'Aprovado' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate mb-0.5">{t.nome}</p>
                              <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(t.data_conclusao).toLocaleDateString('pt-BR')}</span>
                                <span className="text-slate-200">|</span>
                                <span className={t.status === 'Aprovado' ? 'text-green-600' : 'text-red-600'}>{t.status}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold uppercase text-slate-400 mb-0.5">Nota</p>
                              <p className="text-lg font-black text-slate-800">{t.nota.toFixed(0)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* SST Status Module */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xs font-black uppercase text-slate-600 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-nexus-primary" /> Saúde & Segurança (ASO)
                        </h3>
                      </div>
                      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                          <ShieldCheck className="w-10 h-10 text-slate-200" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Módulo em Integração</p>
                          <p className="text-[11px] text-slate-400 mt-2 max-w-[200px] leading-relaxed">
                            Os dados de exames periódicos e ASO serão sincronizados automaticamente.
                          </p>
                        </div>
                        <button className="px-6 py-2 bg-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
                          Solicitar Sincronização
                        </button>
                      </div>
                    </section>

                    {/* Escala Module */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col xl:col-span-2">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xs font-black uppercase text-slate-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-nexus-primary" /> Planejamento de Escalas
                        </h3>
                      </div>
                      <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                          <Calendar className="w-8 h-8 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Aguardando Configuração de Turno</p>
                          <p className="text-[11px] text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                            Este colaborador ainda não possui uma escala definida para o período atual. 
                            Acesse o módulo de Escalas para configurar o regime de trabalho.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
