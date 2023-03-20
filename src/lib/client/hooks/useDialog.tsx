import { PropsWithChildren, useCallback, useState } from "react";
import Dialog, { DialogProps } from "@/components/Dialog";
import Button from "@/components/Button";

export interface OpenDialogOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(({ onConfirm, onCancel }: OpenDialogOptions) => {
    setIsOpen(true);
  }, []);

  const DialogComponent = useCallback(
    ({ children, ...props }: PropsWithChildren<UseDialogComponentProps>) => {
      const { DialogProps = {} } = props;
      return (
        <>
          {isOpen && (
            <UseDialogComponent {...props}>{children}</UseDialogComponent>
          )}
        </>
      );
    },
    []
  );

  return {
    open,
    DialogComponent,
  };
}

export interface UseDialogComponentProps {
  DialogProps?: DialogProps;
}

const UseDialogComponent: React.FC<
  PropsWithChildren<UseDialogComponentProps>
> = ({ children, ...props }) => {
  const { DialogProps } = props;
  return (
    <Dialog {...DialogProps}>
      <>{children}</>

      <div className="flex flex-row gap-4">
        <Button variant="primary">Confirm</Button>
        <Button variant="error">Cancel</Button>
      </div>
    </Dialog>
  );
};
