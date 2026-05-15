import { X, Power } from "lucide-react";
import { useUIStore } from "../../../store/uiStore";
import { useNavigate } from "react-router-dom";

export default function LogoutModal() {
  const navigate = useNavigate();
  const { closeLogoutModal } = useUIStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    navigate("/login");
    closeLogoutModal();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/25 backdrop-blur-[6px]" onClick={closeLogoutModal}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[360px] mx-4 flex flex-col gap-4 shadow-float border border-black/[0.07]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Power size={20} className="text-brand flex-shrink-0" />
          <h2 className="font-serif text-[18px] font-bold text-[#1D1D1F] tracking-[-0.02em] flex-1">
            Finalizar sua sessão
          </h2>
          <button
            onClick={closeLogoutModal}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#86868B] hover:bg-black/[0.06] hover:text-[#1D1D1F] bg-transparent border-0 cursor-pointer transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <p className="text-[14px] text-[#6E6E73] leading-relaxed">
          Tem certeza que deseja sair?
        </p>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 mt-1">
          <button
            onClick={closeLogoutModal}
            className="px-4 py-2 rounded-[10px] text-[14px] font-medium text-[#1D1D1F] border border-black/[0.10] bg-transparent hover:bg-black/[0.04] cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-[10px] text-[14px] font-medium text-white bg-[#FF3B30] hover:bg-[#D62C22] border-0 cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(255,59,48,0.30)]"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
