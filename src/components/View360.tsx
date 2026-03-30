import React, { useState, useEffect } from "react";
import { 
  X, 
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
  Clock,
  Edit2,
  Save,
  Camera,
  X as CloseIcon
} from "lucide-react";
import { motion } from "motion/react";
import { EmployeeForm } from "./EmployeeForm";

export const View360 = ({ id, onClose, initialData }: { id: number, onClose: () => void, initialData?: any }) => {
  const [data, setData] = useState<any>(initialData ? { funcionario: initialData, rh: null, treinamentos: [] } : null);
  const [loading, setLoading] = useState(!initialData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    fetch(`/api/funcionarios/${id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [id]);

  const handleSave = (formData: any) => {
    // Split the data back into funcionario and rh
    const updatedFuncionario = {
      ...data.funcionario,
      nome: formData.nome,
      matricula: formData.matricula,
      cargo: formData.cargo,
      cpf: formData.cpf,
      rg: formData.rg,
      data_nascimento: formData.data_nascimento,
      foto: formData.foto,
      contrato: data.funcionario.contrato
    };
    
    const updatedRh = {
      ...data.rh,
      email: formData.email,
      telefone: formData.telefone,
      endereco: formData.endereco
    };

    setData({ ...data, funcionario: updatedFuncionario, rh: updatedRh });
    setIsEditing(false);
    
    // In a real app, this would be a PUT request
    fetch(`/api/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, contrato: data.funcionario.contrato })
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-text/80 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.02 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-bg w-full h-full shadow-2xl flex flex-col overflow-hidden"
      >
        {!data && loading ? (
          <div className="h-full flex flex-col items-center justify-center text-hint gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] animate-pulse font-mono">Sincronizando Dados 360°...</p>
          </div>
        ) : data && (
          <>
            {/* Header Section */}
            <div className="bg-text p-8 text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full -ml-24 -mb-24 blur-3xl" />
              
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="relative group/photo">
                    <div className="w-24 h-24 bg-white/10 rounded-none flex items-center justify-center text-4xl font-black border border-white/20 shadow-2xl backdrop-blur-md overflow-hidden font-sans">
                      {data.funcionario.foto ? (
                        <img 
                          src={data.funcionario.foto} 
                          alt={data.funcionario.nome} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        data.funcionario.nome.charAt(0)
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success border-4 border-text rounded-full flex items-center justify-center shadow-lg" title="Ativo">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-3xl font-bold tracking-tight font-sans uppercase">{data.funcionario.nome}</h2>
                      <span className="px-3 py-1 bg-white/10 rounded-none text-[10px] font-bold uppercase tracking-widest border border-white/10 font-mono">
                        Matrícula {data.funcionario.matricula}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-accent" />
                      <p className="text-sm font-bold text-muted uppercase tracking-wider font-mono">
                        {data.funcionario.cargo}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-none text-[11px] font-bold uppercase tracking-widest transition-all border border-white/10 group font-mono"
                  >
                    <Edit2 className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                    Editar Dados
                  </button>
                  <button 
                    onClick={onClose} 
                    className="p-3 hover:bg-white/10 rounded-none transition-all border border-white/5 hover:border-white/20 group flex items-center justify-center"
                    title="Fechar"
                  >
                    <CloseIcon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar Info */}
              <div className="w-80 border-r border-border bg-surface overflow-y-auto p-8 space-y-10 shrink-0">
                <section>
                  <h3 className="text-[10px] font-bold uppercase text-hint mb-6 tracking-[0.2em] flex items-center gap-2 font-mono">
                    <IdCard className="w-3.5 h-3.5 text-accent" /> Identificação
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-none bg-surface2 border border-border group hover:border-accent transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1">
                        <Hash className="w-[15px] h-[15px] text-hint group-hover:text-accent transition-colors" />
                        <p className="text-[10px] font-bold uppercase text-hint tracking-wider font-mono">CPF</p>
                      </div>
                      <p className="text-[14px] font-bold text-text pl-7 font-mono">{data.funcionario.cpf}</p>
                    </div>
                    
                    <div className="p-4 rounded-none bg-surface2 border border-border group hover:border-accent transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1">
                        <IdCard className="w-[15px] h-[15px] text-hint group-hover:text-accent transition-colors" />
                        <p className="text-[10px] font-bold uppercase text-hint tracking-wider font-mono">RG</p>
                      </div>
                      <p className="text-[14px] font-bold text-text pl-7 font-mono">{data.funcionario.rg || 'N/A'}</p>
                    </div>

                    <div className="p-4 rounded-none bg-surface2 border border-border group hover:border-accent transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1">
                        <Calendar className="w-[15px] h-[15px] text-hint group-hover:text-accent transition-colors" />
                        <p className="text-[10px] font-bold uppercase text-hint tracking-wider font-mono">Nascimento</p>
                      </div>
                      <p className="text-[14px] font-bold text-text pl-7 font-mono">
                        {data.funcionario.data_nascimento ? (
                          data.funcionario.data_nascimento.includes('-') && data.funcionario.data_nascimento.split('-')[0].length === 4 
                            ? new Date(data.funcionario.data_nascimento).toLocaleDateString('pt-BR')
                            : data.funcionario.data_nascimento
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 rounded-none bg-surface2 border border-border group hover:border-accent transition-all duration-300">
                      <div className="flex items-center gap-3 mb-1">
                        <Calendar className="w-[15px] h-[15px] text-hint group-hover:text-accent transition-colors" />
                        <p className="text-[10px] font-bold uppercase text-hint tracking-wider font-mono">Admissão</p>
                      </div>
                      <p className="text-[14px] font-bold text-text pl-7 font-mono">
                        {data.funcionario.data_admissao ? (
                          data.funcionario.data_admissao.includes('-') && data.funcionario.data_admissao.split('-')[0].length === 4 
                            ? new Date(data.funcionario.data_admissao).toLocaleDateString('pt-BR')
                            : data.funcionario.data_admissao
                        ) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-bold uppercase text-hint mb-6 tracking-[0.2em] flex items-center gap-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-accent" /> Contato Direto
                  </h3>
                  {!data.rh && loading ? (
                    <div className="py-10 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-border mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 rounded-none hover:bg-surface2 transition-colors group">
                        <div className="w-9 h-9 rounded-none bg-accent-light flex items-center justify-center shrink-0 transition-colors">
                          <Mail className="w-4 h-4 text-accent" />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-[8px] font-bold uppercase text-hint tracking-tighter font-mono">E-mail Corporativo</p>
                          <p className="text-xs font-bold text-text truncate font-sans">{data.rh?.email || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 rounded-none hover:bg-surface2 transition-colors group">
                        <div className="w-9 h-9 rounded-none bg-accent-light flex items-center justify-center shrink-0 transition-colors">
                          <Phone className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[8px] font-bold uppercase text-hint tracking-tighter font-mono">Telefone / WhatsApp</p>
                          <p className="text-xs font-bold text-text font-sans">{data.rh?.telefone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Main Modules */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-bg">
                {loading && data.treinamentos.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-border" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Treinamentos Module */}
                    <section className="card p-0 flex flex-col">
                      <div className="p-5 border-b border-border bg-surface2 flex justify-between items-center">
                        <h3 className="text-[11px] font-bold uppercase text-text flex items-center gap-2 font-mono">
                          <GraduationCap className="w-4 h-4 text-accent" /> Treinamentos & Qualificações
                        </h3>
                        <span className="text-[10px] font-bold text-hint bg-surface px-2 py-1 rounded-none border border-border font-mono">
                          {data.treinamentos.length} Registros
                        </span>
                      </div>
                      <div className="p-5 space-y-4">
                        {data.treinamentos.map((t: any, i: number) => (
                          <div key={i} className="group flex items-center gap-4 p-4 rounded-none border border-border hover:border-accent hover:bg-accent-light transition-all">
                            <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 ${
                              t.status === 'Aprovado' ? 'bg-success/10 text-success' : 'bg-accent-light text-accent'
                            }`}>
                              {t.status === 'Aprovado' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-text truncate mb-0.5 font-sans">{t.nome}</p>
                              <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-hint font-mono">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(t.data_conclusao).toLocaleDateString('pt-BR')}</span>
                                <span className="text-border">|</span>
                                <span className={t.status === 'Aprovado' ? 'text-success' : 'text-accent'}>{t.status}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold uppercase text-hint mb-0.5 font-mono">Nota</p>
                              <p className="text-lg font-bold text-text font-mono">{t.nota.toFixed(0)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* SST Status Module */}
                    <section className="card p-0 flex flex-col">
                      <div className="p-5 border-b border-border bg-surface2">
                        <h3 className="text-[11px] font-bold uppercase text-text flex items-center gap-2 font-mono">
                          <ShieldCheck className="w-4 h-4 text-accent" /> Saúde & Segurança (ASO)
                        </h3>
                      </div>
                      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-surface2 rounded-none flex items-center justify-center border border-border shadow-inner">
                          <ShieldCheck className="w-10 h-10 text-border" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase text-hint tracking-widest font-mono">Módulo em Integração</p>
                          <p className="text-[11px] text-muted mt-2 max-w-[200px] leading-relaxed font-sans">
                            Os dados de exames periódicos e ASO serão sincronizados automaticamente.
                          </p>
                        </div>
                        <button className="btn-secondary px-6 py-2">
                          Solicitar Sincronização
                        </button>
                      </div>
                    </section>

                    {/* Escala Module */}
                    <section className="card p-0 flex flex-col xl:col-span-2">
                      <div className="p-5 border-b border-border bg-surface2">
                        <h3 className="text-[11px] font-bold uppercase text-text flex items-center gap-2 font-mono">
                          <Calendar className="w-4 h-4 text-accent" /> Planejamento de Escalas
                        </h3>
                      </div>
                      <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-surface2 rounded-none flex items-center justify-center border border-dashed border-border">
                          <Calendar className="w-8 h-8 text-border" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase text-hint tracking-widest font-mono">Aguardando Configuração de Turno</p>
                          <p className="text-[11px] text-muted mt-2 max-w-sm mx-auto leading-relaxed font-sans">
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
            <EmployeeForm 
              isOpen={isEditing} 
              onClose={() => setIsEditing(false)} 
              onSave={handleSave} 
              initialData={{ ...data.funcionario, ...data.rh }}
              title="Editar Colaborador"
            />
          </>
        )}
      </motion.div>
    </div>
  );
};
