import { useLocation, Link } from "react-router-dom";
import {
  ArrowDownUp,
  Plus,
  Users,
  User,
  LogOut,
  Activity,
  LayoutDashboard,
  Layers,
  BarChart2,
  Search,
} from "lucide-react";

import { useUIStore } from "../../store/uiStore";
import logoImage from "../../../assets/kf-logo.png";

const NAV_PRIMARY = [
  { to: "/criar-flow",  icon: Plus,            label: "Criar Flow"  },
  { to: "/feed",        icon: ArrowDownUp,      label: "Flow Network" },
  { to: "/dashboard",   icon: LayoutDashboard,  label: "Dashboard"   },
  { to: "/pulse",       icon: Activity,         label: "Pulse"       },
  { to: "/workspaces",  icon: Layers,           label: "Workspaces", matchPrefix: "/workspace" },
  { to: "/analytics",   icon: BarChart2,        label: "Analytics"   },
  { to: "/busca",       icon: Search,           label: "Busca"       },
];

const NAV_SECONDARY = [
  { to: "/comunidade", icon: Users, label: "Comunidade" },
  { to: "/perfil",     icon: User,  label: "Perfil"     },
];

const Sidebar = () => {
  const location = useLocation();
  const { openLogoutModal } = useUIStore();

  const isActive = (to, matchPrefix) => {
    if (matchPrefix) return location.pathname.startsWith(matchPrefix);
    return location.pathname === to;
  };

  return (
    <aside className="group/sidebar fixed top-0 left-0 h-screen z-[200] flex flex-col overflow-hidden w-16 hover:w-60 transition-[width] duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)] bg-white/80 backdrop-blur-[20px] [backdrop-filter:blur(20px)_saturate(180%)] border-r border-black/[0.07] shadow-[1px_0_0_rgba(0,0,0,0.07)] hover:shadow-[4px_0_24px_rgba(0,0,0,0.07),1px_0_0_rgba(0,0,0,0.07)]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-[14px] pt-3 pb-3 mb-5 flex-shrink-0 overflow-hidden min-h-[52px]">
        <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-[10px] overflow-hidden">
          <img src={logoImage} alt="KnowFlow" className="w-full h-full object-contain" />
        </div>
        <span className="text-[15px] font-bold text-[#1D1D1F] tracking-[-0.03em] whitespace-nowrap opacity-0 -translate-x-1.5 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 transition-[opacity,transform] duration-[180ms] ease-in-out delay-[100ms]">
          KnowFlow
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-px px-2 flex-1">
        {NAV_PRIMARY.map(({ to, icon: Icon, label, matchPrefix }) => {
          const active = isActive(to, matchPrefix);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-[9px] h-[38px] rounded-[10px] no-underline transition-colors duration-150 overflow-hidden whitespace-nowrap flex-shrink-0 ${
                active
                  ? "bg-[rgba(35,61,255,0.09)] text-[#233DFF]"
                  : "text-[#6E6E73] hover:bg-black/[0.04] hover:text-[#1D1D1F]"
              }`}
            >
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              </div>
              <span className="text-[13.5px] font-[500] tracking-[-0.01em] opacity-0 -translate-x-1.5 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 transition-[opacity,transform] duration-[180ms] ease-in-out delay-[80ms]">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-black/[0.07] mx-3 my-1.5 flex-shrink-0" />

      {/* Bottom section */}
      <div className="flex flex-col gap-px px-2 pb-4 flex-shrink-0">
        {NAV_SECONDARY.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-[9px] h-[38px] rounded-[10px] no-underline transition-colors duration-150 overflow-hidden whitespace-nowrap flex-shrink-0 ${
                active
                  ? "bg-[rgba(35,61,255,0.09)] text-[#233DFF]"
                  : "text-[#6E6E73] hover:bg-black/[0.04] hover:text-[#1D1D1F]"
              }`}
            >
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              </div>
              <span className="text-[13.5px] font-[500] tracking-[-0.01em] opacity-0 -translate-x-1.5 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 transition-[opacity,transform] duration-[180ms] ease-in-out delay-[80ms]">
                {label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={openLogoutModal}
          className="flex items-center gap-2.5 px-[9px] h-[38px] w-full rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6E6E73] hover:bg-[#FFF1F0] hover:text-[#FF3B30] transition-colors duration-150 overflow-hidden whitespace-nowrap flex-shrink-0 text-left active:scale-[0.98]"
        >
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
            <LogOut size={17} strokeWidth={1.8} />
          </div>
          <span className="text-[13.5px] font-[500] tracking-[-0.01em] opacity-0 -translate-x-1.5 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 transition-[opacity,transform] duration-[180ms] ease-in-out delay-[80ms]">
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
