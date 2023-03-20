import { CSSProperties } from "react";
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
  const { BackdropProps, className = "bg-white", style } = props;

  return (
    <>
      <div
        className={`absolute inset-x-0 z-40 mx-auto flex rounded-xl shadow-lg shadow-black/25 md:w-1/2 ${className}`}
        style={style}
      >
        {children}
      </div>

      <Backdrop {...BackdropProps} />
    </>
  );
}
