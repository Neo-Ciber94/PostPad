import { BsRobot } from "react-icons/bs";
import Button from "./Button";
import LoadingSpinner from "./loading/LoadingSpinner";
import Tooltip from "./Tooltip";

export interface GenerateAIPostButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
}

export function GenerateAIPostButton({
  onClick,
  isLoading,
}: GenerateAIPostButtonProps) {
  return (
    <Tooltip
      content={isLoading ? "Stop post generation" : "Generate a post with AI"}
      minWidth={250}
    >
      <Button
        type="button"
        className="flex min-w-[150px] flex-row gap-2"
        variant={isLoading ? "secondary" : "accent"}
        onClick={onClick}
      >
        {isLoading ? <LoadingSpinner size={20} width={3}/> : <BsRobot size={20} />}

        <span className="text-md">{isLoading ? "Stop" : "Generate"}</span>
      </Button>
    </Tooltip>
  );
}
