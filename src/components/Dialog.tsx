import Backdrop, { BackdropProps } from "./Backdrop";

export interface DialogProps {
  BackdropProps?: BackdropProps;
  className?: string;
}

export function Dialog({
  children,
  ...props
}: React.PropsWithChildren<DialogProps>) {
  const { BackdropProps, className = "bg-white" } = props;

  return (
    <>
      <div
        className={`absolute inset-x-0 z-40 mx-auto flex min-h-[300px] w-4/5 rounded-xl shadow-lg shadow-black/25 md:w-1/2 ${className}`}
      >
        {children}
      </div>

      <Backdrop {...BackdropProps} />
    </>
  );
}
