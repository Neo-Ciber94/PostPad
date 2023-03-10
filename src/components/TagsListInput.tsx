import { useState } from "react";
import { useNextId } from "@/lib/client/hooks/useNextId";
import EditableChip from "./EditableChip";

type TagItem = {
  // Key send from the data base
  id?: string;

  // Key used to track in the client
  key: string;

  // Value of the tag
  name: string;
};

export interface TagsListInputProps {
  tags?: TagItem[];
  maxLength?: number;
  chipColor?: string;
  chipTextColor?: string;
  onChange?: (tag: TagItem[]) => void;
}

export default function TagsListInput(props: TagsListInputProps) {
  const { onChange, chipColor, chipTextColor, maxLength } = props;
  const nextId = useNextId("tag-");
  const [text, setText] = useState("");
  const [tags, setTags] = useState<TagItem[]>(() => {
    const initialTags = props.tags || [];

    // If the tag don't had an id, we need to generate an unique id on the client
    // used for tracking
    return initialTags.map((t) => ({ ...t, key: t.id ?? nextId() }));
  });

  const handleChangeTags = (newTags: TagItem[]) => {
    setTags(newTags);

    if (onChange) {
      onChange(newTags);
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

    const newTag: TagItem = {
      key: nextId(),
      name: newText,
    };

    const newTags = [...tags, newTag];
    handleChangeTags(newTags);
  };

  const handleEditTag = (id: string, newValue: string) => {
    const tag = tags.find((t) => t.key === id)!;

    if (maxLength) {
      newValue = newValue.substring(0, maxLength);
    }

    if (newValue.trim().length === 0) {
      handleDeleteTag(id);
      return;
    }

    const newTag = { ...tag, value: newValue };
    const newTags = tags.map((t) => (t.key === id ? newTag : t));
    handleChangeTags(newTags);
  };

  const handleDeleteTag = (id: string) => {
    const newTags = tags.filter((t) => t.key !== id);
    handleChangeTags(newTags);
  };

  const removeLastTag = () => {
    if (tags.length === 0) {
      return;
    }

    const newTags = [...tags];
    newTags.pop();
    setTags(newTags);
  };

  return (
    <div
      className="flex w-full flex-row flex-wrap gap-2 
    rounded-lg border-[1px] border-gray-600 p-2"
    >
      {tags.map((tag) => (
        <EditableChip
          editable
          key={tag.key}
          value={tag.name}
          color={chipTextColor}
          backgroundColor={chipColor}
          onDelete={() => handleDeleteTag(tag.key)}
          onChange={(val) => handleEditTag(tag.key, val)}
        />
      ))}

      <input
        value={text}
        onChange={handleTextChange}
        className="flex-grow bg-transparent text-white outline-none"
        maxLength={maxLength}
        onBlur={handleAddTag}
        placeholder={tags.length > 0 ? undefined : "Add Tag..."}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
          }

          if (e.key === "Backspace" && text.length === 0) {
            e.preventDefault();
            removeLastTag();
          }
        }}
      />
    </div>
  );
}
