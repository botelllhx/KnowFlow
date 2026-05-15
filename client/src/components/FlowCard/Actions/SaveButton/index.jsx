import { Bookmark } from "lucide-react";
import { useFlowStore } from "../../../../store/flowStore";

export default function SaveButton({ saves, flowId }) {
  const savedPosts = useFlowStore((state) => state.savedPosts);
  const toggleSave = useFlowStore((state) => state.toggleSave);
  const isSaved = savedPosts.includes(String(flowId));

  return (
    <button
      onClick={() => flowId && toggleSave(flowId)}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[12.5px] font-medium border-0 cursor-pointer transition-all duration-150 ${
        isSaved
          ? "bg-brand-light text-brand"
          : "bg-transparent text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
      }`}
    >
      <Bookmark
        size={14}
        style={{
          color: isSaved ? "#233DFF" : "#AEAEB2",
          fill: isSaved ? "#233DFF" : "none",
          transition: "color 0.15s ease, fill 0.15s ease",
        }}
      />
      {saves}
    </button>
  );
}
