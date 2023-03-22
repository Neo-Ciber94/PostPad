import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface TooltipProps {
  content: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  tooltipClassName?: string;
}

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  children,
  tooltipClassName,
  ...props
}) => {
  const { content, minWidth, minHeight } = props;

  return (
    <div className="group relative flex flex-row flex-nowrap justify-center">
      {children}
      <TooltipContent
        minWidth={minWidth}
        minHeight={minHeight}
        className={tooltipClassName}
      >
        {content}
      </TooltipContent>
    </div>
  );
};

export default Tooltip;

interface TooltipContentProps {
  className?: string;
  minWidth?: number;
  minHeight?: number;
}

const TooltipContent: React.FC<PropsWithChildren<TooltipContentProps>> = ({
  children,
  className,
  minWidth,
  minHeight,
}) => {
  // @tw
  const defaultClassName = `invisible absolute top-[120%] after:absolute after:left-1/2 after:bottom-[100%] 
    after:ml-[-12px] after:border-[12px] after:border-black/80 after:border-x-transparent 
  after:border-t-transparent after:content-[''] group-hover:visible text-white bg-black/80 text-center rounded-lg p-4`;

  return (
    <div
      className={twMerge(defaultClassName, className)}
      style={{ minWidth, minHeight }}
    >
      {children}
    </div>
  );
};
