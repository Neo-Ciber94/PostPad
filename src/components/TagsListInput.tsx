import { useState } from "react";
import { useNextId } from "@/hooks/useNextId";
import EditableChip from "./EditableChip";

export interface TagsListInputProps {
  values?: string[];
  maxLength?: number;
  onChange?: (value: string[]) => void;
}

type Tag = {
  id: string;
  value: string;
};

export default function TagsListInput(props: TagsListInputProps) {
  const { values, onChange, maxLength } = props;
  const nextId = useNextId("tag-");
  const [text, setText] = useState("");
  const [tags, setTags] = useState<Tag[]>(() => {
    const initialTags = values || [];
    return initialTags.map((value) => ({ id: nextId(), value }));
  });

  const handleChangeTags = (newTags: Tag[]) => {
    setTags(newTags);

    if (onChange) {
      const tagValues = newTags.map((t) => t.value);
      onChange(tagValues);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newText = e.target.value;

    if (maxLength) {
      newText = newText.substring(0, maxLength);
    }

    setText(newText);
  };

  const handleAddTag = () => {
    let newText = text;

    if (maxLength) {
      newText = newText.substring(0, maxLength);
    }

    setText("");

    if (newText.trim().length === 0) {
      return;
    }

    const newTag: Tag = {
      id: nextId(),
      value: newText,
    };

    const newTags = [...tags, newTag];
    handleChangeTags(newTags);
  };

  const handleEditTag = (id: string, newValue: string) => {
    const tag = tags.find((t) => t.id === id)!;

    if (maxLength) {
      newValue = newValue.substring(0, maxLength);
    }

    if (newValue.trim().length === 0) {
      handleDeleteTag(id);
      return;
    }

    const newTag = { ...tag, value: newValue };
    const newTags = tags.map((t) => (t.id === id ? newTag : t));
    handleChangeTags(newTags);
  };

  const handleDeleteTag = (id: string) => {
    const newTags = tags.filter((t) => t.id !== id);
    handleChangeTags(newTags);
  };

  return (
    <div
      className="flex w-full flex-row flex-wrap gap-2 
    rounded-lg border-[1px] border-gray-600 p-2"
    >
      {tags.map((tag) => (
        <EditableChip
          editable
          value={tag.value}
          key={tag.id}
          onDelete={() => handleDeleteTag(tag.id)}
          onChange={(val) => handleEditTag(tag.id, val)}
        />
      ))}

      <input
        value={text}
        onChange={handleTextChange}
        className="flex-grow bg-transparent 
        text-white outline-none"
        maxLength={maxLength}
        onBlur={handleAddTag}
        placeholder={tags.length > 0 ? undefined : "Add Tag..."}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
          }
        }}
      />
    </div>
  );
}
