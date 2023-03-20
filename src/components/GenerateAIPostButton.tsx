import { BsRobot } from "react-icons/bs";
import Button from "./Button";
import Tooltip from "./Tooltip";

export interface GenerateAIPostButtonProps {
  onClick?: () => void;
}

export function GenerateAIPostButton({ onClick }: GenerateAIPostButtonProps) {
  return (
    <Tooltip content="Generate a post with AI" minWidth={250}>
      <Button
        type="button"
        className="flex flex-row gap-2"
        variant="accent"
        onClick={onClick}
      >
        <BsRobot size={20} />
        <span className="text-md">Generate</span>
      </Button>
    </Tooltip>
  );
}
