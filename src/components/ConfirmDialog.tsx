import { PropsWithChildren } from "react";
import Button from "./Button";
import Dialog from "./Dialog";

export interface ConfirmDialogProps {
  title: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmDialog: React.FC<PropsWithChildren<ConfirmDialogProps>> = ({
  children,
  ...props
}) => {
  const { title, onConfirm, onCancel, onClose } = props;

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
      className="bg-base-500"
      BackdropProps={{
        onClick: onClose,
      }}
    >
      <div className="flex flex-1 flex-col">
        <header>
          <nav
            className="flex h-16 cursor-pointer flex-row items-center justify-between overflow-hidden 
          rounded-t-xl bg-alt-500 px-4 py-3 text-white shadow-md"
          >
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
            Confirm
          </Button>
          <Button type="button" variant="error" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
