import Backdrop, { BackdropProps } from "./Backdrop";

export interface DialogProps {
  BackdropProps?: BackdropProps;
}

export function Dialog({
  children,
  ...props
}: React.PropsWithChildren<DialogProps>) {
  const { BackdropProps } = props;
  
  return (
    <>
      <div className="absolute inset-x-0 z-40 mx-auto flex min-h-[300px] w-4/5 rounded-xl bg-slate-700 shadow-lg shadow-black/25 md:w-1/2">
        {children}
      </div>

      <Backdrop {...BackdropProps} />
    </>
  );
}
