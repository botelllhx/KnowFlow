import { useFlowStore } from "../../../../store/flowStore";
import { Button, SaveIcon } from "./style";

export default function SaveButton({ saves, flowId }) {
  const savedPosts = useFlowStore((state) => state.savedPosts);
  const toggleSave = useFlowStore((state) => state.toggleSave);
  const isSaved = savedPosts.includes(String(flowId));

  return (
    <Button $active={isSaved} onClick={() => flowId && toggleSave(flowId)}>
      <SaveIcon $active={isSaved} />
      {saves}
    </Button>
  );
}
