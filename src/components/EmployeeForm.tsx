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
    email: "", telefone: "", foto: ""
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
        foto: initialData.foto || ""
      });
    } else {
      setFormData({
        nome: "", cpf: "", rg: "", data_nascimento: "", matricula: "", data_admissao: "", cargo: "",
        email: "", telefone: "", foto: ""
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
            className="bg-white rounded-none w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="bg-surface p-6 border-b border-border flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-light rounded-none flex items-center justify-center">
                  {initialData ? <Briefcase className="w-6 h-6 text-accent" /> : <UserPlus className="w-6 h-6 text-accent" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-text font-sans">{title || (initialData ? "Editar Colaborador" : "Novo Colaborador")}</h3>
                  <p className="text-[10px] text-hint uppercase tracking-widest mt-0.5 font-mono">
                    {initialData ? "Atualize as informações do registro" : "Preencha os dados para cadastro"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="hover:bg-surface2 p-2 rounded-none transition-colors text-hint hover:text-text">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-8 bg-background">
              <form id="employee-form-shared" onSubmit={handleSubmit} className="space-y-10">
                {/* Foto do Colaborador */}
                <section className="flex flex-col items-center mb-10">
                  <div className="relative group/photo">
                    <div className="w-40 h-40 bg-surface rounded-none flex items-center justify-center text-6xl font-black border border-border2 overflow-hidden shadow-sm">
                      {formData.foto ? (
                        <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-border">{formData.nome ? formData.nome.charAt(0) : "?"}</span>
                      )}
                      <label className="absolute inset-0 bg-accent/80 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/photo:opacity-100 transition-opacity">
                        <Camera className="w-10 h-10 text-white mb-2" />
                        <span className="text-[10px] font-bold uppercase text-white tracking-widest">Alterar Foto</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                      </label>
                    </div>
                  </div>
                </section>

                {/* Dados Pessoais */}
                <section>
                  <h4 className="text-xs font-bold uppercase text-accent mb-6 flex items-center gap-2 border-b border-border2 pb-3 font-sans tracking-widest">
                    <Users className="w-4 h-4" /> Dados Pessoais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">Nome Completo</label>
                      <input className="input-field" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required placeholder="Ex: João da Silva" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">CPF</label>
                      <input className="input-field font-mono" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} required placeholder="000.000.000-00" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">RG</label>
                      <input className="input-field font-mono" value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} required placeholder="00.000.000-0" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">Data de Nascimento</label>
                      <CustomDatePicker 
                        value={formData.data_nascimento} 
                        onChange={date => setFormData({...formData, data_nascimento: date})} 
                      />
                    </div>
                  </div>
                </section>

                {/* Contato */}
                <section>
                  <h4 className="text-xs font-bold uppercase text-accent mb-6 flex items-center gap-2 border-b border-border2 pb-3 font-sans tracking-widest">
                    <Phone className="w-4 h-4" /> Contato
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">E-mail Corporativo</label>
                      <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="joao@empresa.com" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">Telefone / WhatsApp</label>
                      <input className="input-field font-mono" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} required placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                </section>

                {/* Dados Profissionais */}
                <section>
                  <h4 className="text-xs font-bold uppercase text-accent mb-6 flex items-center gap-2 border-b border-border2 pb-3 font-sans tracking-widest">
                    <Briefcase className="w-4 h-4" /> Dados Profissionais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">Matrícula</label>
                      <input className="input-field font-mono font-bold" value={formData.matricula} onChange={e => setFormData({...formData, matricula: e.target.value})} required placeholder="EX: 10045" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">Data de Admissão</label>
                      <input type="date" className="input-field cursor-pointer font-mono" value={formData.data_admissao} onChange={e => setFormData({...formData, data_admissao: e.target.value})} required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-hint mb-2 tracking-widest">Função / Cargo</label>
                      <input className="input-field" value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} required placeholder="Ex: Operador de Máquina" />
                    </div>
                  </div>
                </section>
              </form>
            </div>
            
            <div className="p-8 border-t border-border bg-surface shrink-0 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="btn-secondary px-8 py-3">
                Cancelar
              </button>
              <button type="submit" form="employee-form-shared" className="btn-primary px-10 py-3">
                {initialData ? "Salvar Alterações" : "Salvar Registro"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
