"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchInput from "@/components/SearchInput";
import TagFilter, { SelectedTag } from "@/components/TagFilter";
import { useDebounce, useDebounceState } from "@/lib/client/hooks/useDebounce";
import { Note } from "@/lib/server/schemas/Note";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Button from "../../Button";
import NoteList from "../../NoteList";

export interface NoteListPageBase {
  initialNotes: Note[];
}

export default function NotesListPageBase({ initialNotes }: NoteListPageBase) {
  const router = useRouter();
  const [searchString, setSearchString] = useState("");
  const search = useDebounce(searchString, 500);
  const [searchTags, setSearchTags] = useState<SelectedTag[]>([]);

  const handleChangeTagFilter = (tags: SelectedTag[]) => {
    setSearchTags(tags);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchString(value);
    router.refresh();
  };

  const {
    data: notes = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery(["notes", search, searchTags], {
    queryFn: () => fetchNotes(search, searchTags),
    enabled: false, // we fetch manually
    initialData: initialNotes,
  });

  useEffect(() => {
    if (search.trim().length > 0 || searchTags.length > 0) {
      refetch();
    }
  }, [search, searchTags]);

  return (
    <div className="p-2 text-white">
      <div className="py-2 px-10 md:px-[10%] lg:px-[25%]">
        <NewNoteButton />
      </div>

      <div className="px-10 md:px-[10%] lg:px-[20%]">
        <hr className="my-8 bg-gray-400 opacity-10" />
        <div className="mt-4 mb-8 flex flex-col gap-2">
          <TagFilter
            onChange={handleChangeTagFilter}
            selectedTags={searchTags}
          />
          <SearchInput value={searchString} onInput={handleSearchChange} />
        </div>
        {isLoading || isFetching ? (
          <div className="my-20">
            <LoadingSpinner
              size={60}
              width={5}
              color="rgba(255, 255, 255, 0.2)"
            />
          </div>
        ) : (
          <NoteList notes={notes} />
        )}
      </div>
    </div>
  );
}

function NewNoteButton() {
  return (
    <Link href="/notes/new" className="w-full pb-5">
      <Button variant="accent" className="w-full font-bold">
        New Note
      </Button>
    </Link>
  );
}

async function fetchNotes(searchString: string, tags: SelectedTag[]) {
  const searchParams = new URLSearchParams();

  if (searchString.trim().length > 0) {
    searchParams.set("search", searchString);
  }

  if (tags.length > 0) {
    tags.forEach((t) => searchParams.append("tags", t.name));
  }

  const queryString = searchParams.toString();
  const q = queryString.length > 0 ? `?${queryString}` : "";

  const res = await fetch(`/api/notes${q}`);
  const json = await res.json();
  return json as Note[];
}
