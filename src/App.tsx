import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  GraduationCap, 
  LogOut, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Components
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { RHModule } from "./components/RHModule";
import { SSTModule } from "./components/SSTModule";
import { EscalaModule } from "./components/EscalaModule";
import { TreinamentoModule } from "./components/TreinamentoModule";
import { EmployeePortal } from "./components/EmployeePortal";
import { View360 } from "./components/View360";

// Types
import { User, Contract } from "./types";
import { useContract } from "./contexts/ContractContext";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState("dashboard");
  const { currentContract, setCurrentContract } = useContract();
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isPortal, setIsPortal] = useState(window.location.search.includes("portal=true"));
  const [showContractMenu, setShowContractMenu] = useState(false);
  const contractMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contractMenuRef.current && !contractMenuRef.current.contains(event.target as Node)) {
        setShowContractMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "RH", "SST", "Escala", "Treinamento", "Gestor"] },
    { id: "rh", label: "Funcionários", icon: Users, roles: ["Admin", "RH"] },
    { id: "escala", label: "Escala", icon: Calendar, roles: ["Admin", "Escala"], disabled: true },
    { id: "sst", label: "SST / ASO", icon: ShieldCheck, roles: ["Admin", "SST"], disabled: true },
    { id: "treinamento", label: "Treinamentos", icon: GraduationCap, roles: ["Admin", "Treinamento"] },
  ];

  // Ensure active module is allowed, otherwise fallback to dashboard
  useEffect(() => {
    if (!user) return;
    const moduleConfig = menuItems.find(m => m.id === activeModule);
    const isAllowed = moduleConfig && moduleConfig.roles.includes(user.role) && !moduleConfig.disabled;
    if (!isAllowed) {
      setActiveModule("dashboard");
    }
  }, [user?.role, activeModule]);

  if (isPortal) return <EmployeePortal onExit={() => {
    setIsPortal(false);
    window.history.pushState({}, '', window.location.pathname);
  }} />;
  if (!user) return <Login onLogin={setUser} />;

  const filteredMenu = menuItems.filter(item => {
    const hasRole = item.roles.includes(user.role);
    if (currentContract !== "TECA") {
      return hasRole && (item.id === "dashboard" || item.id === "rh");
    }
    return hasRole;
  });
  const activeModuleLabel = menuItems.find(m => m.id === activeModule)?.label || "Dashboard";

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header className="h-16 bg-surface flex items-center justify-between px-8 sticky top-0 z-50 border-b border-border">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <img 
              src="https://lh3.googleusercontent.com/d/1sNzDKhdh2zH8d8DoyqIjx8l5LzBEXN5g" 
              alt="WFS Logo" 
              className="h-12 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="h-6 w-[1px] bg-border mx-2"></div>
            <h1 className="text-lg font-bold tracking-tight text-text font-sans">WFS SYSTEM</h1>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {filteredMenu.map(item => (
              <button 
                key={item.id}
                onClick={() => !item.disabled && setActiveModule(item.id)}
                disabled={item.disabled}
                title={item.disabled ? "Módulo em desenvolvimento" : ""}
                className={`flex items-center gap-2 px-4 py-2 rounded-none text-[11px] font-bold uppercase tracking-widest transition-all font-mono ${
                  item.disabled 
                    ? 'opacity-40 cursor-not-allowed text-hint' 
                    : activeModule === item.id 
                      ? 'bg-accent text-white' 
                      : 'text-muted hover:text-text hover:bg-surface2'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={contractMenuRef}>
            <button 
              onClick={() => setShowContractMenu(!showContractMenu)}
              className="flex items-center justify-between gap-4 bg-surface hover:bg-surface2 px-4 py-2 rounded-none transition-all border border-border2 min-w-[220px]"
            >
              <p className="text-[11px] font-bold text-text uppercase tracking-tight font-mono">
                Contrato: <span className="text-accent">{currentContract}</span>
              </p>
              <ChevronDown className="w-4 h-4 text-hint" />
            </button>

            <AnimatePresence>
              {showContractMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 w-full bg-surface shadow-xl border border-border py-1 z-50 overflow-hidden rounded-none"
                >
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-[10px] font-bold text-hint uppercase font-mono">Trocar Contrato</p>
                  </div>
                  {(["TECA", "RAMPA", "CANAL DE INSPEÇÃO"] as Contract[]).map(c => (
                    <button 
                      key={c}
                      onClick={() => { setCurrentContract(c); setShowContractMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider font-mono ${currentContract === c ? 'text-accent bg-accent-light' : 'text-muted hover:bg-surface2'}`}
                    >
                      {c}
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button 
                      onClick={() => setUser(null)}
                      className="w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-danger hover:bg-accent-light flex items-center gap-2 font-mono"
                    >
                      <LogOut className="w-3 h-3" /> Logoff
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentContract}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <div className={activeModule === "dashboard" ? "block" : "hidden"}>
                <Dashboard currentContract={currentContract} />
              </div>
              
              <div className={activeModule === "rh" ? "block" : "hidden"}>
                <RHModule user={user} onViewDetails={setSelectedEmployee} currentContract={currentContract} />
              </div>
              
              <div className={activeModule === "sst" ? "block" : "hidden"}>
                <SSTModule user={user} currentContract={currentContract} />
              </div>
              
              <div className={activeModule === "escala" ? "block" : "hidden"}>
                <EscalaModule user={user} currentContract={currentContract} />
              </div>
              
              <div className={activeModule === "treinamento" ? "block" : "hidden"}>
                <TreinamentoModule user={user} currentContract={currentContract} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer / Quick Actions */}
      <footer className="h-10 bg-surface border-t border-border flex items-center justify-between px-8 text-[10px] font-bold text-hint uppercase tracking-widest font-mono">
        <div>WFS SYSTEM v2.0.0 • Gestão Operacional de Aeroportos</div>
        <div className="flex gap-6">
          <button onClick={() => setIsPortal(true)} className="hover:text-accent transition-colors">Portal do Colaborador</button>
          <span>Suporte Técnico WFS</span>
        </div>
      </footer>

      {/* View 360 Overlay */}
      <AnimatePresence>
        {selectedEmployee && (
          <View360 
            id={selectedEmployee.id} 
            initialData={selectedEmployee} 
            onClose={() => setSelectedEmployee(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
