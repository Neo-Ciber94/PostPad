import { useCallback, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

export interface PromptDialogOptions {
  title: string;
  placeholder?: string;
  onConfirm?: (prompt: string) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function usePromptDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOptions, setDialogOptions] =
    useState<PromptDialogOptions | null>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);

    if (dialogOptions?.onClose) {
      dialogOptions.onClose();
    }

    setDialogOptions(null);
  }, [dialogOptions]);

  const handleConfirm = useCallback(
    (prompt: string) => {
      if (dialogOptions?.onConfirm) {
        dialogOptions.onConfirm(prompt);
      }

      handleClose();
    },
    [dialogOptions, handleClose]
  );

  const open = useCallback((options: PromptDialogOptions) => {
    setIsOpen(true);
    setDialogOptions(options);
  }, []);

  const DialogComponent = useCallback(() => {
    return (
      <>
        {isOpen && dialogOptions && (
          <PromptDialog
            placeholder={dialogOptions.placeholder}
            title={dialogOptions.title}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        )}
      </>
    );
  }, [dialogOptions, handleClose, handleConfirm, isOpen]);

  return {
    open,
    DialogComponent,
  };
}

interface PromptDialogProps {
  title: string;
  placeholder?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

const PromptDialog: React.FC<PromptDialogProps> = (props) => {
  const [prompt, setPrompt] = useState("");
  const { title, placeholder = "Prompt...", onConfirm, onClose } = props;

  return (
    <ConfirmDialog
      title={title}
      onClose={onClose}
      onConfirm={() => onConfirm(prompt)}
      confirmLabel="Generate"
      cancelLabel="Cancel"
    >
      <div className="p-4">
        <textarea
          className="max-h-[300px] w-full resize-none overflow-hidden
              rounded-md border-none bg-base-600 p-4 text-white shadow-sm outline-none"
          placeholder={placeholder}
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onInput={(e) => {
            // Auto resize text area
            // https://stackoverflow.com/a/24676492/9307869
            const element = e.currentTarget;
            element.style.height = "auto";
            element.style.height = element.scrollHeight + "px";
          }}
        />
      </div>
    </ConfirmDialog>
  );
};
