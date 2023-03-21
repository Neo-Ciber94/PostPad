import { useCallback, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { noEmptyPrompt } from "@/lib/utils/schemas/noempty";
import { zodResolver } from "@hookform/resolvers/zod";

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

const promptInputSchema = z.object({
  prompt: z.string().pipe(noEmptyPrompt),
});

type PromptInput = z.infer<typeof promptInputSchema>;

const PromptDialog: React.FC<PromptDialogProps> = (props) => {
  const { title, placeholder = "Prompt...", onConfirm, onClose } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptInput>({
    resolver: zodResolver(promptInputSchema),
  });

  return (
    <ConfirmDialog
      title={title}
      onClose={onClose}
      onCancel={onClose}
      confirmLabel="Generate"
      cancelLabel="Cancel"
      onConfirm={handleSubmit(({ prompt }) => {
        onConfirm(prompt);
      })}
    >
      <form>
        <div className="p-4">
          <textarea
            {...register("prompt")}
            className={`max-h-[300px] w-full resize-none overflow-hidden
            rounded-md bg-base-600 p-4 text-white shadow-sm outline-none ${
              errors.prompt ? "border border-red-500" : ""
            }`}
            placeholder={placeholder}
            rows={1}
            onInput={(e) => {
              // Auto resize text area
              // https://stackoverflow.com/a/24676492/9307869
              const element = e.currentTarget;
              element.style.height = "auto";
              element.style.height = element.scrollHeight + "px";
            }}
          />
          {errors.prompt && (
            <p className="text-xs italic text-red-500">
              {errors.prompt?.message}
            </p>
          )}
        </div>
      </form>
    </ConfirmDialog>
  );
};
