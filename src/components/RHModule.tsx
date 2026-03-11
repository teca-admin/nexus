import React, { useState, useEffect } from "react";
import { Search, Filter, Mail, Phone, Briefcase, Calendar, X, UserPlus, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, Funcionario, Contract } from "../types";
import { CustomSelect, CustomDatePicker } from "./CustomComponents";

export const RHModule = ({ user, onViewDetails, currentContract }: { user: User, onViewDetails?: (funcionario: Funcionario) => void, currentContract: Contract }) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [formData, setFormData] = useState({
    nome: "", cpf: "", rg: "", data_nascimento: "", matricula: "", data_admissao: "", cargo: "", contrato: "",
    email: "", telefone: "", endereco: "", setor: ""
  });

  const load = () => fetch(`/api/funcionarios?contrato=${currentContract}`).then(res => res.json()).then(setFuncionarios);
  useEffect(() => { load(); }, [currentContract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Optimistic update
    const tempId = Date.now();
    const newFuncionario = {
      ...formData,
      id: tempId,
      status: "Ativo"
    } as Funcionario;
    
    setFuncionarios(prev => [newFuncionario, ...prev]);
    setShowForm(false);
    setFormData({ nome: "", cpf: "", rg: "", data_nascimento: "", matricula: "", data_admissao: "", cargo: "", setor: "", email: "", telefone: "", endereco: "" });

    const res = await fetch("/api/funcionarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) {
      const data = await res.json();
      setFuncionarios(prev => prev.map(f => f.id === tempId ? { ...f, id: data.id } : f));
    } else {
      // Revert on error
      setFuncionarios(prev => prev.filter(f => f.id !== tempId));
      load();
    }
  };

  const canEdit = user.role === "Admin" || user.role === "RH";

  const hasPendingInfo = (f: Funcionario) => {
    return !f.rg || f.rg.trim() === "" || !f.data_nascimento || f.data_nascimento.trim() === "" || !f.data_admissao || f.data_admissao.trim() === "";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const filteredFuncionarios = funcionarios.filter(f => {
    const matchesSearch = f.nome.toLowerCase().includes(searchQuery.toLowerCase()) || f.matricula.includes(searchQuery);
    const matchesStatus = filterStatus === "Todos" || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 w-full space-y-6">
      <div className="bg-white p-4 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-nexus-primary" />
            Gestão de Funcionários
          </h2>
          <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest">
            {funcionarios.length} Colaboradores Registrados
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center flex-1 justify-end">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou matrícula..." 
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-nexus-primary focus:ring-0 rounded-none px-9 py-2.5 text-sm outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
            <CustomSelect 
              options={[
                { label: "Todos os Status", value: "Todos" },
                { label: "Ativos", value: "Ativo" },
                { label: "Inativos", value: "Inativo" },
                { label: "Em Férias", value: "Férias" },
                { label: "Afastados", value: "Afastado" }
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Todos os Status"
            />
          </div>
          {canEdit && (
            <button onClick={() => setShowForm(true)} className="bg-nexus-primary text-white font-bold uppercase text-xs tracking-widest px-6 py-3 rounded-none hover:bg-nexus-primary/90 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer">
              <UserPlus className="w-4 h-4" /> Novo Funcionário
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-none shadow-sm border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-fixed">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="w-64 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Colaborador</th>
                <th className="w-24 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Matrícula</th>
                <th className="w-40 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Cargo</th>
                <th className="w-24 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Contrato</th>
                <th className="w-32 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">CPF</th>
                <th className="w-32 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">RG</th>
                <th className="w-28 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Nascimento</th>
                <th className="w-28 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Admissão</th>
                <th className="w-24 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Status</th>
                <th className="w-24 px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Pendências</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFuncionarios.length > 0 ? (
                filteredFuncionarios.map(f => (
                  <tr 
                    key={f.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer" 
                    onDoubleClick={() => onViewDetails?.(f)}
                    onMouseEnter={() => {
                      // Prefetch data
                      fetch(`/api/funcionarios/${f.id}`).catch(() => {});
                    }}
                  >
                    <td className="px-6 py-4 truncate">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-nexus-primary/10 text-nexus-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {f.nome.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-slate-800 group-hover:text-nexus-primary transition-colors truncate">{f.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-700 truncate">{f.matricula}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-600 truncate">{f.cargo}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-600 truncate">{f.contrato}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-600 truncate">{f.cpf}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-600 truncate">{f.rg || "-"}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-600 truncate">{formatDate(f.data_nascimento || "") || "-"}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-600 truncate">{formatDate(f.data_admissao)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        f.status === 'Ativo' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        f.status === 'Férias' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        f.status === 'Afastado' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          f.status === 'Ativo' ? 'bg-green-500' : 
                          f.status === 'Férias' ? 'bg-amber-500' :
                          f.status === 'Afastado' ? 'bg-orange-500' :
                          'bg-slate-500'
                        }`}></span>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {hasPendingInfo(f) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                          Pendente
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">OK</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Nenhum funcionário encontrado</h3>
                    <p className="text-xs text-slate-400">Tente ajustar os filtros ou a busca.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-nexus-sidebar p-6 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">Novo Colaborador</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Preencha os dados para cadastro</p>
                  </div>
                </div>
                <button onClick={() => setShowForm(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6">
                <form id="employee-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Dados Pessoais */}
                  <section>
                    <h4 className="text-xs font-bold uppercase text-nexus-primary mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Users className="w-4 h-4" /> Dados Pessoais
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Nome Completo</label>
                        <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '13px', fontFamily: 'system-ui', fontWeight: 'normal' }} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required placeholder="Ex: João da Silva" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">CPF</label>
                        <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '13px', fontFamily: 'system-ui' }} value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} required placeholder="000.000.000-00" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">RG</label>
                        <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '13px', fontFamily: 'system-ui' }} value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} required placeholder="00.000.000-0" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Data de Nascimento</label>
                        <CustomDatePicker 
                          value={formData.data_nascimento} 
                          onChange={date => setFormData({...formData, data_nascimento: date})} 
                          style={{ fontSize: '13px', fontFamily: 'system-ui' }}
                          textStyle={{ color: '#aaaaaa', fontSize: '12px' }}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Contato */}
                  <section>
                    <h4 className="text-xs font-bold uppercase text-nexus-primary mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Phone className="w-4 h-4" /> Contato
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">E-mail Corporativo</label>
                        <input type="email" className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '12px', fontFamily: 'system-ui' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="joao@empresa.com" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Telefone / WhatsApp</label>
                        <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '12px', fontFamily: 'system-ui' }} value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} required placeholder="(00) 00000-0000" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Endereço Completo</label>
                        <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '12px', fontFamily: 'system-ui' }} value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} required placeholder="Rua, Número, Bairro, Cidade - UF" />
                      </div>
                    </div>
                  </section>

                  {/* Dados Profissionais */}
                  <section>
                    <h4 className="text-xs font-bold uppercase text-nexus-primary mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Briefcase className="w-4 h-4" /> Dados Profissionais
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Matrícula</label>
                        <input className="input-field font-mono bg-slate-50 focus:bg-white" style={{ fontSize: '12px', fontFamily: 'system-ui' }} value={formData.matricula} onChange={e => setFormData({...formData, matricula: e.target.value})} required placeholder="EX: 10045" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Data de Admissão</label>
                        <input type="date" className="input-field bg-slate-50 focus:bg-white cursor-pointer" style={{ fontSize: '12px', fontFamily: 'system-ui' }} value={formData.data_admissao} onChange={e => setFormData({...formData, data_admissao: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Função / Cargo</label>
                        <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '12px', fontFamily: 'system-ui' }} value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} required placeholder="Ex: Operador de Máquina" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Contrato</label>
                        <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '12px', fontFamily: 'system-ui' }} value={formData.contrato} onChange={e => setFormData({...formData, contrato: e.target.value})} required placeholder="Ex: TECA" />
                      </div>
                    </div>
                  </section>
                </form>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-slate-500 font-bold uppercase text-xs tracking-wider hover:bg-slate-200 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" form="employee-form" className="btn-primary px-8 py-2.5 text-xs tracking-wider shadow-lg shadow-nexus-primary/20">
                  Salvar Registro
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
