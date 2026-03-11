import React, { useState, useEffect } from "react";
import { X, UserPlus, Users, Phone, Briefcase, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Funcionario } from "../types";
import { CustomDatePicker } from "./CustomComponents";

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  title?: string;
}

export const EmployeeForm = ({ isOpen, onClose, onSave, initialData, title }: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    nome: "", cpf: "", rg: "", data_nascimento: "", matricula: "", data_admissao: "", cargo: "",
    email: "", telefone: "", endereco: "", foto: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || "",
        cpf: initialData.cpf || "",
        rg: initialData.rg || "",
        data_nascimento: initialData.data_nascimento || "",
        matricula: initialData.matricula || "",
        data_admissao: initialData.data_admissao || "",
        cargo: initialData.cargo || "",
        email: initialData.email || "",
        telefone: initialData.telefone || "",
        endereco: initialData.endereco || "",
        foto: initialData.foto || ""
      });
    } else {
      setFormData({
        nome: "", cpf: "", rg: "", data_nascimento: "", matricula: "", data_admissao: "", cargo: "",
        email: "", telefone: "", endereco: "", foto: ""
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6">
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
                  {initialData ? <Briefcase className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">{title || (initialData ? "Editar Colaborador" : "Novo Colaborador")}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                    {initialData ? "Atualize as informações do registro" : "Preencha os dados para cadastro"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="employee-form-shared" onSubmit={handleSubmit} className="space-y-8">
                {/* Foto do Colaborador */}
                <section className="flex flex-col items-center mb-8">
                  <div className="relative group/photo">
                    <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-5xl font-black border-2 border-dashed border-slate-200 overflow-hidden">
                      {formData.foto ? (
                        <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-slate-300">{formData.nome ? formData.nome.charAt(0) : "?"}</span>
                      )}
                      <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/photo:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white mb-1" />
                        <span className="text-[10px] font-bold uppercase text-white">Alterar Foto</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                      </label>
                    </div>
                  </div>
                </section>

                {/* Dados Pessoais */}
                <section>
                  <h4 className="text-xs font-bold uppercase text-nexus-primary mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Users className="w-4 h-4" /> Dados Pessoais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Nome Completo</label>
                      <input className="input-field bg-slate-50 focus:bg-white" style={{ fontSize: '13px', fontFamily: 'system-ui' }} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required placeholder="Ex: João da Silva" />
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
                  </div>
                </section>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-500 font-bold uppercase text-xs tracking-wider hover:bg-slate-200 rounded-lg transition-colors">
                Cancelar
              </button>
              <button type="submit" form="employee-form-shared" className="btn-primary px-8 py-2.5 text-xs tracking-wider shadow-lg shadow-nexus-primary/20">
                {initialData ? "Salvar Alterações" : "Salvar Registro"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
