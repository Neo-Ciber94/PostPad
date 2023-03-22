import { BsRobot } from "react-icons/bs";
import Tooltip from "./Tooltip";

export default function AIGeneratedTag() {
  return (
    <Tooltip
      minWidth={200}
      content={<span className="text-xs">This post was AI generated</span>}
      tooltipClassName="p-1"
    >
      <div
        className="flex cursor-pointer flex-row items-center gap-2 rounded-full bg-black  py-2 px-4 shadow-inner
    shadow-indigo-400"
      >
        <BsRobot className="text-white" />
        <span className=" text-xs font-semibold text-white">AI Generated</span>
      </div>
    </Tooltip>
  );
}
