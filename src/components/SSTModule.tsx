import React from "react";
import { ShieldCheck } from "lucide-react";
import { User, Contract } from "../types";

export const SSTModule = ({ user, currentContract }: { user: User, currentContract: Contract }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldCheck className="w-32 h-32 text-border mb-8" />
      <h2 className="text-3xl font-bold text-text tracking-tight mb-4 uppercase font-sans">Módulo SST / ASO</h2>
      <p className="text-muted max-w-md mx-auto font-mono text-sm">
        Este módulo está atualmente em desenvolvimento e estará disponível em breve para gestão de saúde e segurança.
      </p>
    </div>
  );
};
