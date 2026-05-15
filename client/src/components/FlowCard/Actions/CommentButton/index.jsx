import { MessageCircle } from "lucide-react";

export default function CommentButton({ comments }) {
  return (
    <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-[12.5px] font-medium text-[#6E6E73] border-0 cursor-pointer bg-transparent hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-all duration-150">
      <MessageCircle size={14} className="text-[#AEAEB2]" />
      {comments}
    </button>
  );
}
