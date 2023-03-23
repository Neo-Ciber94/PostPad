import { CSSProperties, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import Dialog from "./Dialog";

export interface ConfirmDialogProps {
  title: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog: React.FC<PropsWithChildren<ConfirmDialogProps>> = ({
  children,
  ...props
}) => {
  const {
    title,
    className = "",
    style,
    onConfirm,
    onCancel,
    onClose,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
  } = props;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog
      className={twMerge(`bg-base-500`, className)}
      style={style}
      BackdropProps={{
        onClick: onClose,
      }}
    >
      <div className="flex flex-1 flex-col">
        <header className="overflow-hidden rounded-t-xl">
          <nav className="flex cursor-pointer flex-row items-center justify-between bg-alt-500 px-4 py-3 text-white shadow-md">
            <div className="flex flex-row items-center">
              {typeof title === "string" ? (
                <span className="text-xl">{title}</span>
              ) : (
                <>{title}</>
              )}
            </div>

            <button className="text-2xl hover:opacity-40" onClick={onClose}>
              &times;
            </button>
          </nav>
        </header>

        {children}

        <div className="mb-2 mt-auto flex flex-row gap-2 self-stretch px-2">
          <Button type="button" variant="primary" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
          <Button type="button" variant="error" onClick={handleCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
