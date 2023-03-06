import { useKeyboardEvent } from "@/hooks/useKeyboardEvent";
import { useOuterClick } from "@/hooks/useOuterClick";
import { PaintBrushIcon } from "@heroicons/react/24/outline";
import { forwardRef, useRef, useState } from "react";
import Backdrop from "./Backdrop";

export interface ColorPickerProps {
  color?: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  useKeyboardEvent({
    keys: "Escape",
    onKeyDown(event) {
      console.log(event);
      handleClose();
    },
  });

  const handleChangeColor = (color: string) => {
    console.log({ color });
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

// const COLORS = [
//   "#f1c40f", // bright yellow
//   "#fceabb", // pastel yellow
//   "#e74c3c", // bright red
//   "#ffb6c1", // pastel red
//   "#1abc9c", // bright green
//   "#d5f5e3", // pastel green
//   "#3498db", // bright blue
//   "#bfefff", // pastel blue
//   "#9b59b6", // bright purple
//   "#e2b0ff", // pastel purple
//   "#ff6600", // bright orange
//   "#ffd8b1", // pastel orange
//   "#ecf0f1", // bright gray
//   "#d3d3d3", // pastel gray
// ];

const COLORS = [
"#7F1D1D",
"#7C2D12",
"#78350F",
"#713F12",
"#365314",
"#14532D",
"#064E3B",
"#134E4A",
"#164E63",
"#0C4A6E",
"#1E3A8A",
"#312E81",
"#4C1D95",
"#581C87",
"#701A75",
"#831843",
"#881337",
"#1C1917",
"#171717",
"#111827",
"#0F172A",
];

export interface ColorPickerDialogProps {
  color?: string;
  onClose: () => void;
  onChange: (color: string) => void;
}

// eslint-disable-next-line react/display-name
const ColorPickerDialog = forwardRef<HTMLDivElement, ColorPickerDialogProps>(
  (props, ref) => {
    const { color, onClose, onChange } = props;
    const [selectedColor, setSelectedColor] = useState<string | undefined>(
      color
    );

    const handleSelectColor = (color: string) => {
      setSelectedColor(color);
      onChange(color);
    };

    return (
      <>
        <div
          className="absolute left-0 right-0 z-40 
        mx-auto w-2/6 max-w-[400px] shadow-xl lg:w-[400px]"
        >
          <div
            ref={ref}
            className="shadow-[rgba(0,0,0,0.4) overflow-hidden rounded-2xl"
          >
            <header>
              <nav className="flex h-12 cursor-pointer flex-row justify-between overflow-hidden rounded-t-2xl bg-slate-600 p-3 shadow-md text-white">
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
              {COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`h-10 w-10 cursor-pointer rounded ${
                    color === selectedColor
                      ? "border-[3px] border-[rgba(0,0,0,0.4)]"
                      : "hover:border-[3px] hover:border-[rgba(0,0,0,0.2)]"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleSelectColor(color)}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <Backdrop />
      </>
    );
  }
);
