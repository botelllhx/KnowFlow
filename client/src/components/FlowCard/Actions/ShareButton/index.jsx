import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({ flowID }) {
  const handleShare = () => {
    const url = `${window.location.origin}/flow/${flowID}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copiado!"))
      .catch(() => toast.error("Erro ao copiar o link."));
  };

  return (
    <button
      onClick={handleShare}
      title="Compartilhar"
      className="flex items-center gap-1 px-3 py-2 rounded-lg border-0 cursor-pointer bg-transparent text-[#AEAEB2] hover:bg-[#F5F5F7] hover:text-[#233DFF] transition-all duration-150"
    >
      <Share2 size={14} />
    </button>
  );
}
