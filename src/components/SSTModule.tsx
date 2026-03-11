import React from "react";
import { ShieldCheck } from "lucide-react";
import { User, Contract } from "../types";

export const SSTModule = ({ user, currentContract }: { user: User, currentContract: Contract }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
      <ShieldCheck className="w-24 h-24 text-slate-200 mb-6" />
      <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-2 uppercase">Módulo SST / ASO</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        Este módulo está atualmente em desenvolvimento e estará disponível em breve.
      </p>
    </div>
  );
};
