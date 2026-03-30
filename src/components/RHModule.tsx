import React, { useState, useEffect } from "react";
import { Search, Filter, Mail, Phone, Briefcase, Calendar, X, UserPlus, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, Funcionario, Contract } from "../types";
import { CustomSelect } from "./CustomComponents";
import { EmployeeForm } from "./EmployeeForm";

export const RHModule = ({ user, onViewDetails, currentContract }: { user: User, onViewDetails?: (funcionario: Funcionario) => void, currentContract: Contract }) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");

  const load = () => fetch(`/api/funcionarios?contrato=${currentContract}`).then(res => res.json()).then(setFuncionarios);
  useEffect(() => { load(); }, [currentContract]);

  const handleSave = async (formData: any) => {
    // Optimistic update
    const tempId = Date.now();
    const newFuncionario = {
      ...formData,
      contrato: currentContract,
      id: tempId,
      status: "Ativo"
    } as Funcionario;
    
    setFuncionarios(prev => [newFuncionario, ...prev]);
    setShowForm(false);

    const res = await fetch("/api/funcionarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, contrato: currentContract }),
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
    if (!dateStr) return "-";
    // Tenta tratar formatos YYYY-MM-DD ou DD/MM/YYYY
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts[0].length === 4) return `${parts[2]}/${parts[1]}/${parts[0]}`; // YYYY-MM-DD
      return `${parts[0]}/${parts[1]}/${parts[2]}`; // DD-MM-YYYY
    }
    if (dateStr.includes("/")) {
      return dateStr; // Já está no formato esperado ou similar
    }
    return dateStr;
  };

  const filteredFuncionarios = funcionarios.map(f => ({
    ...f,
    status: f.status || "Ativo" // Default status if null
  })).filter(f => {
    const matchesSearch = f.nome.toLowerCase().includes(searchQuery.toLowerCase()) || f.matricula.includes(searchQuery);
    const matchesStatus = filterStatus === "Todos" || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-8">
      <div className="bg-surface p-6 border border-border shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text tracking-tight uppercase flex items-center gap-3 font-sans">
            <Users className="w-6 h-6 text-accent" />
            Gestão de Funcionários
          </h2>
          <p className="text-[11px] font-mono font-bold text-hint uppercase tracking-widest mt-1">
            {funcionarios.length} Colaboradores Registrados
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center flex-1 justify-end">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-hint" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou matrícula..." 
              className="input-field pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Filter className="w-4 h-4 text-hint absolute left-3 top-1/2 -translate-y-1/2 z-10" />
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
            <button onClick={() => setShowForm(true)} className="btn-primary px-8 py-3 flex items-center gap-2 whitespace-nowrap">
              <UserPlus className="w-4 h-4" /> Novo Funcionário
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-64">Colaborador</th>
                <th className="w-24 text-center">Matrícula</th>
                <th className="w-40 text-center">Cargo</th>
                <th className="w-24 text-center">Contrato</th>
                <th className="w-32 text-center">CPF</th>
                <th className="w-32 text-center">RG</th>
                <th className="w-28 text-center">Nascimento</th>
                <th className="w-28 text-center">Admissão</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-24 text-center">Pendências</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuncionarios.length > 0 ? (
                filteredFuncionarios.map(f => (
                  <tr 
                    key={f.id} 
                    className="group cursor-pointer" 
                    onDoubleClick={() => onViewDetails?.(f)}
                  >
                    <td className="truncate">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent-light text-accent flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                          {f.nome.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-text group-hover:text-accent transition-colors truncate">{f.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center font-mono text-xs font-bold">{f.matricula}</td>
                    <td className="text-center text-xs font-bold text-muted uppercase font-mono">{f.cargo}</td>
                    <td className="text-center text-xs font-bold text-muted uppercase font-mono">{f.contrato}</td>
                    <td className="text-center text-xs font-bold text-muted font-mono">{f.cpf}</td>
                    <td className="text-center text-xs font-bold text-muted font-mono">{f.rg || "-"}</td>
                    <td className="text-center text-xs font-bold text-muted font-mono">{formatDate(f.data_nascimento || "") || "-"}</td>
                    <td className="text-center text-xs font-bold text-muted font-mono">{formatDate(f.data_admissao)}</td>
                    <td className="text-center">
                      <span className={`badge ${
                        f.status === 'Ativo' ? 'badge-success' : 
                        f.status === 'Férias' ? 'bg-accent-light text-accent' :
                        f.status === 'Afastado' ? 'bg-surface2 text-muted' :
                        'bg-surface2 text-hint'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {hasPendingInfo(f) ? (
                        <span className="badge bg-accent-light text-danger">
                          Pendente
                        </span>
                      ) : (
                        <span className="text-[10px] text-hint uppercase font-mono font-bold">OK</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-surface2 mb-4">
                      <Search className="w-8 h-8 text-hint" />
                    </div>
                    <h3 className="text-sm font-bold text-text uppercase tracking-widest mb-1 font-mono">Nenhum funcionário encontrado</h3>
                    <p className="text-xs text-muted font-mono">Tente ajustar os filtros ou a busca.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeForm 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        onSave={handleSave} 
      />
    </div>
  );
};
