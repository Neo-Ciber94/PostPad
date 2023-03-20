import { PropsWithChildren } from "react";

export interface TooltipProps {
  content: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
}

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  children,
  ...props
}) => {
  const { content, minWidth, minHeight } = props;

  return (
    <div className="group relative flex flex-row flex-nowrap justify-center">
      {children}
      <TooltipContent minWidth={minWidth} minHeight={minHeight}>
        {content}
      </TooltipContent>
    </div>
  );
};

export default Tooltip;

interface TooltipContentProps {
  minWidth?: number;
  minHeight?: number;
}

const TooltipContent: React.FC<PropsWithChildren<TooltipContentProps>> = ({
  children,
  minWidth,
  minHeight,
}) => {
  return (
    <div
      style={{
        minWidth,
        minHeight,
      }}
      className="invisible absolute top-[120%]
    rounded-lg bg-black/80 p-4 text-center text-white
      after:absolute after:left-1/2 after:bottom-[100%] after:ml-[-12px]
     after:border-[12px] after:border-black/80 after:border-x-transparent 
     after:border-t-transparent after:content-[''] group-hover:visible"
    >
      {children}
    </div>
  );
};
