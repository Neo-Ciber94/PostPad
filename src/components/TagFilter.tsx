import { Tag } from "@/lib/server/schemas/Tag";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import {
  AdjustmentsHorizontalIcon,
  InboxIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import Alert from "./Alert";
import Button from "./Button";
import { Dialog } from "./Dialog";
import LoadingSpinner from "./loading/LoadingSpinner";

export type SelectedTag = Omit<Tag, "postId">;

export interface TagFilterProps {
  selectedTags?: SelectedTag[];
  onChange?: (tag: SelectedTag[]) => void;
}

export default function TagFilter({ selectedTags, onChange }: TagFilterProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (tags: SelectedTag[]) => {
    if (onChange) {
      onChange(tags);
    }
  };

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        type="button"
        className="flex w-fit flex-row items-center gap-3 rounded-full py-2 
        pl-3 pr-10 text-white transition duration-200 hover:bg-slate-900/50"
      >
        <AdjustmentsHorizontalIcon className="h-7 w-7 " />
        <span className="text-xl">Filters</span>
      </button>

      {dialogOpen && (
        <TagSelectorDialog
          values={selectedTags}
          onChange={handleChange}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}

interface TagSelectorDialog {
  values?: SelectedTag[];
  onChange: (tags: SelectedTag[]) => void;
  onInput?: (tags: SelectedTag[]) => void;
  onClose: () => void;
}

function TagSelectorDialog(props: TagSelectorDialog) {
  const { onChange, onClose, onInput, values } = props;
  const [tagSearch, setTagSearch] = useState("");

  const {
    isLoading,
    data = [],
    error,
    isError,
  } = useQuery(["tags"], fetchTags);

  const tags = useMemo(() => {
    return data.filter((t) =>
      t.name.trim().toLowerCase().includes(tagSearch.trim().toLowerCase())
    );
  }, [tagSearch, data]);

  const [selectedTags, setSelectedTags] = useState(() => {
    const init = values || [];
    return init.reduce(
      (prev, p) => ({ ...prev, [p.id]: p }),
      {} as Record<string, SelectedTag>
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTagSearch(text);
  };

  const handleChange = () => {
    onChange(Object.values(selectedTags));
    onClose();
  };

  const handleToggle = (tag: SelectedTag) => {
    const isSelected = selectedTags[tag.id] != null;
    const newTags = { ...selectedTags };
    if (isSelected) {
      delete newTags[tag.id];
    } else {
      newTags[tag.id] = { ...tag };
    }

    setSelectedTags(newTags);
    if (onInput) {
      onInput(Object.values(newTags));
    }
  };

  const isSelected = (id: string) => selectedTags[id] != null;

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
              <TagIcon className="mr-3 h-6 w-6 text-white" />
              <span className="text-xl">Tags</span>
            </div>

            <button className="text-2xl hover:opacity-40" onClick={onClose}>
              &times;
            </button>
          </nav>
        </header>

        {isLoading && (
          <div className="my-4">
            <LoadingSpinner />
          </div>
        )}

        <div
          className="my-3 max-h-[280px] 
          overflow-y-auto scrollbar-thin
            scrollbar-track-base-300/25
            scrollbar-thumb-base-700 
            scrollbar-thumb-rounded-lg"
        >
          {tags.length > 0 && (
            <>
              <div className="my-4 px-4">
                <label>Filter by name</label>
                <input
                  value={tagSearch}
                  onInput={handleInputChange}
                  className="mt-2 w-full rounded-md py-3 
                px-4 text-black shadow-md shadow-black/25"
                  type="search"
                  placeholder="Tag name..."
                />
              </div>

              <div className="mb-4 flex flex-row flex-wrap gap-2 p-2">
                {tags.map((tag) => (
                  <TagToggle
                    key={tag.id}
                    tag={tag}
                    selected={isSelected(tag.id)}
                    onClick={() => handleToggle(tag)}
                  />
                ))}
              </div>
            </>
          )}

          {tags.length === 0 && (
            <div className="my-4 flex flex-col items-center justify-center gap-2 p-4 opacity-30">
              <InboxIcon className="h-12 w-12" />
              <span className="text-2xl">No tags were found</span>
            </div>
          )}
        </div>

        {isError && (
          <div className="my-4 px-2">
            <Alert color="#e00">
              {getErrorMessage(error) || "Something went wrong"}
            </Alert>
          </div>
        )}

        <div className="mb-2 mt-auto flex flex-row gap-2 self-stretch px-2">
          <Button type="button" variant="primary" onClick={handleChange}>
            Save
          </Button>
          <Button type="button" variant="error" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

interface TagToggleProps {
  tag: SelectedTag;
  selected: boolean;
  onClick: () => void;
}

function TagToggle({ tag, selected, onClick }: TagToggleProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-md min-w-[70px] rounded-full py-2 px-4
        shadow-md shadow-black/25 transition
        duration-200
        ${
          selected
            ? "bg-accent-500 text-black ring-2 ring-black/50"
            : "bg-black  text-white"
        }`}
    >
      {tag.name}
    </button>
  );
}

async function fetchTags() {
  const res = await fetch(`/api/tags`, {
    headers: {
      "content-type": "application/json",
    },
  });
  const json = await res.json();
  return json as SelectedTag[];
}
