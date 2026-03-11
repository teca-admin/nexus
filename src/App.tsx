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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white text-slate-800 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-nexus-primary rounded flex items-center justify-center font-black text-xl text-white">N</div>
            <h1 className="text-xl font-bold tracking-tighter text-nexus-sidebar">NEXUS</h1>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {filteredMenu.map(item => (
              <button 
                key={item.id}
                onClick={() => !item.disabled && setActiveModule(item.id)}
                disabled={item.disabled}
                title={item.disabled ? "Módulo em desenvolvimento" : ""}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  item.disabled 
                    ? 'opacity-40 cursor-not-allowed text-slate-400 border-transparent' 
                    : activeModule === item.id 
                      ? 'bg-white border-slate-200 shadow-sm text-nexus-sidebar' 
                      : 'text-slate-500 hover:text-nexus-sidebar hover:bg-slate-50 border-transparent'
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
              className="flex items-center justify-between gap-4 bg-white hover:bg-slate-50 px-4 py-2 rounded-[9px] transition-all border border-slate-200 shadow-sm min-w-[200px]"
            >
              <p className="text-xs font-black text-nexus-sidebar uppercase tracking-tight">
                Contrato: <span className="text-nexus-primary">{currentContract}</span>
              </p>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {showContractMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-1 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Trocar Contrato</p>
                  </div>
                  {(["TECA", "RAMPA", "CANAL DE INSPEÇÃO"] as Contract[]).map(c => (
                    <button 
                      key={c}
                      onClick={() => { setCurrentContract(c); setShowContractMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider ${currentContract === c ? 'text-nexus-primary bg-nexus-primary/5' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {c}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button 
                      onClick={() => setUser(null)}
                      className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center gap-2"
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
      <main className="flex-1 bg-nexus-bg overflow-y-auto relative">
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
      </main>

      {/* Footer / Quick Actions */}
      <footer className="h-10 bg-white border-t flex items-center justify-between px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div>NEXUS v1.0.0 • Enterprise Resource Planning</div>
        <div className="flex gap-4">
          <button onClick={() => setIsPortal(true)} className="hover:text-nexus-primary transition-colors">Acessar Portal do Colaborador</button>
          <span>Suporte: 0800-NEXUS</span>
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
