import { ShareIcon } from "@heroicons/react/24/solid";
import Button from "./Button";

type SharePostButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const SharePostButton: React.FC<SharePostButtonProps> = (props) => {
  return (
    <Button
      {...props}
      className="flex flex-row justify-between gap-2 bg-amber-200 text-black focus:ring focus:ring-amber-600 hover:bg-amber-400"
    >
      <span>
        <ShareIcon className="h-4 w-4" />
      </span>
      <span>Share</span>
    </Button>
  );
};

export default SharePostButton;
