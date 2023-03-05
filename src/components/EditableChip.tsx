import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export interface EditableChipProps {
  value: string;
  color?: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  onDelete?: () => void;
}

export default function EditableChip(props: EditableChipProps) {
  const { value, onChange, onDelete, color, editable } = props;
  const [text, setText] = useState(value);

  const handleChangeText = (e: React.ChangeEvent<HTMLElement>) => {
    if (editable !== true) {
      return;
    }

    const newValue = e.target.outerText;
    setText(newValue);
  };

  const handleChange = () => {
    if (onChange) {
      onChange(text);
    }
  };

  return (
    <div
      className="flex flex-row items-center gap-2 rounded-xl px-3 py-1"
      style={{
        backgroundColor: color || "#a00",
        color: "white",
      }}
    >
      <span
        className="break-all outline-none"
        suppressContentEditableWarning={editable}
        contentEditable={editable}
        onInput={handleChangeText}
        onBlur={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleChange();
          }
        }}
      >
        {value}
      </span>

      {editable === true && (
        <button
          className="rounded-full p-0.5 hover:bg-red-900"
          type="button"
          onClick={onDelete}
        >
          <XMarkIcon className="h-4 w-4 text-gray-200" />
        </button>
      )}
    </div>
  );
}
