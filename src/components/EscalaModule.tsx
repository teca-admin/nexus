import React from "react";
import { Calendar } from "lucide-react";
import { User, Contract } from "../types";

export const EscalaModule = ({ user, currentContract }: { user: User, currentContract: Contract }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Calendar className="w-32 h-32 text-border mb-8" />
      <h2 className="text-3xl font-bold text-text tracking-tight mb-4 uppercase font-sans">Módulo de Escalas</h2>
      <p className="text-muted max-w-md mx-auto font-mono text-sm">
        Este módulo está atualmente em desenvolvimento e estará disponível em breve para planejamento de turnos.
      </p>
    </div>
  );
};
