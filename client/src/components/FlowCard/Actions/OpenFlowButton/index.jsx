import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../../../store/uiStore";

export default function OpenFlowButton({ flowID }) {
  const navigate = useNavigate();
  const closeSearchModal = useUIStore((state) => state.closeSearchModal);

  const handleClick = () => {
    closeSearchModal();
    navigate(`/flow/${flowID}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 ml-auto px-4 py-2 bg-[#233DFF] hover:bg-[#1A2ECC] text-white text-[12.5px] font-semibold rounded-lg border-0 cursor-pointer transition-all duration-150 shadow-brand hover:shadow-brand-hover hover:-translate-y-px active:translate-y-0"
    >
      Ver Flow
      <ArrowUpRight size={14} strokeWidth={2.5} />
    </button>
  );
}
