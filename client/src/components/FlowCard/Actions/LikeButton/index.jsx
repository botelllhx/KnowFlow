import { useFlowStore } from "../../../../store/flowStore";
import { Button, LikeIcon } from "./style";

export default function LikeButton({ likes, flowId }) {
  const likedPosts = useFlowStore((state) => state.likedPosts);
  const toggleLike = useFlowStore((state) => state.toggleLike);
  const isLiked = likedPosts.includes(String(flowId));

  return (
    <Button $active={isLiked} onClick={() => flowId && toggleLike(flowId)}>
      <LikeIcon $active={isLiked} />
      {likes}
    </Button>
  );
}
