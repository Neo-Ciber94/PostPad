import { useKeyboardEvent } from "@/lib/client/hooks/useKeyboardEvent";
import { useOuterClick } from "@/lib/client/hooks/useOuterClick";
import { PaintBrushIcon } from "@heroicons/react/24/outline";
import { forwardRef, useRef, useState } from "react";
import Backdrop from "./Backdrop";

/**
 * The colors allowed in the color picker.
 */
export const PICKER_COLORS = [
  "#541818",
  "#7e3a3a",
  "#092658",
  "#3b3a7e",
  "#083f2d",
  "#3a7e4f",
  "#220c2f",
  "#471130",
  "#313131",
  "#717171",
] as const;

export interface ColorPickerProps {
  color?: string;
  onChange: (color: string | undefined) => void;
}

/**
 * Open a modal to select a color
 * @deprecated We are not using this anymore
 */
export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  useKeyboardEvent({
    keys: "Escape",
    onKeyDown() {
      handleClose();
    },
  });

  const handleChangeColor = (color: string | undefined) => {
    onChange(color);
  };

  const colorPickerDialogRef = useRef<HTMLDivElement | null>(null);
  useOuterClick({
    ref: colorPickerDialogRef,
    onClickOutside() {
      handleClose();
    },
  });

  return (
    <>
      <button
        type="button"
        className="rounded-full bg-slate-600 p-3 shadow-lg 
        transition-colors duration-200 hover:bg-slate-900"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <PaintBrushIcon className="h-4 w-4 text-white" />
      </button>

      {isOpen && (
        <ColorPickerDialog
          ref={colorPickerDialogRef}
          color={color}
          onChange={handleChangeColor}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export interface ColorPickerDialogProps {
  color?: string;
  onClose: () => void;
  onChange: (color: string | undefined) => void;
}

// eslint-disable-next-line react/display-name
const ColorPickerDialog = forwardRef<HTMLDivElement, ColorPickerDialogProps>(
  (props, ref) => {
    const { color, onClose, onChange } = props;
    const [selectedColor, setSelectedColor] = useState<string | undefined>(
      color
    );

    const handleSelectColor = (color: string | undefined) => {
      setSelectedColor(color);
      onChange(color);
    };

    return (
      <>
        <div
          className="absolute inset-x-0 z-40 
        mx-auto w-2/6 max-w-[400px] shadow-xl lg:w-[400px]"
        >
          <div
            ref={ref}
            className="shadow-black/40 overflow-hidden rounded-2xl"
          >
            <header>
              <nav className="flex h-12 cursor-pointer flex-row justify-between overflow-hidden rounded-t-2xl bg-base-500 p-3 text-white shadow-md">
                <div className="flex flex-row items-center">
                  <PaintBrushIcon className="mr-3 h-4 w-4 text-white" />
                  <span>Pick a Color</span>
                </div>

                <button className="hover:opacity-40" onClick={onClose}>
                  &times;
                </button>
              </nav>
            </header>

            <div className="flex flex-row flex-wrap gap-2 bg-white px-3 py-6">
              {PICKER_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`h-10 w-10 cursor-pointer rounded ${
                    color === selectedColor
                      ? "border-[3px] border-black/40"
                      : "hover:border-[3px] hover:border-black/10"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleSelectColor(color)}
                ></button>
              ))}
              <ClearColorButton
                type="button"
                onClick={() => handleSelectColor(undefined)}
              />
            </div>
          </div>
        </div>
        <Backdrop />
      </>
    );
  }
);

type ClearColorButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
function ClearColorButton(props: ClearColorButtonProps) {
  return (
    <button
      {...props}
      className={`h-10 w-10 cursor-pointer rounded border-2 border-dashed border-black hover:border-neutral-400`}
    ></button>
  );
}
