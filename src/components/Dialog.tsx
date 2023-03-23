import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";
import Backdrop, { BackdropProps } from "./Backdrop";

export interface DialogProps {
  BackdropProps?: BackdropProps;
  className?: string;
  style?: CSSProperties;
}

export default function Dialog({
  children,
  ...props
}: React.PropsWithChildren<DialogProps>) {
  const { BackdropProps, className, style } = props;

  // @tw
  const dialogBaseClassName = `absolute bg-white inset-x-0 z-40 mx-auto flex rounded-xl shadow-lg shadow-black/25 md:w-1/2`;

  return (
    <>
      <div className={twMerge(dialogBaseClassName, className)} style={style}>
        {children}
      </div>

      <Backdrop {...BackdropProps} />
    </>
  );
}
