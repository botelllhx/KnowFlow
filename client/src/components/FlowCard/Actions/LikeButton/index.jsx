import { Heart } from "lucide-react";
import { useFlowStore } from "../../../../store/flowStore";

export default function LikeButton({ likes, flowId }) {
  const likedPosts = useFlowStore((state) => state.likedPosts);
  const toggleLike = useFlowStore((state) => state.toggleLike);
  const isLiked = likedPosts.includes(String(flowId));

  return (
    <button
      onClick={() => flowId && toggleLike(flowId)}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[12.5px] font-medium border-0 cursor-pointer transition-all duration-150 ${
        isLiked
          ? "bg-brand-light text-brand"
          : "bg-transparent text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
      }`}
    >
      <Heart
        size={14}
        style={{
          color: isLiked ? "#233DFF" : "#AEAEB2",
          fill: isLiked ? "#233DFF" : "none",
          transition: "color 0.15s ease, fill 0.15s ease",
        }}
      />
      {likes}
    </button>
  );
}
