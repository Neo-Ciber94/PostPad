"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchInput from "@/components/SearchInput";
import { useDebounce, useDebounceState } from "@/lib/client/hooks/useDebounce";
import { Note } from "@/lib/server/schemas/Note";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchString(value);
    router.refresh();
  };

  const {
    data: notes = [],
    isLoading,
    isFetching,
  } = useQuery(["notes", search], {
    queryFn: () => fetchNotes(search),
    enabled: !!search && search.trim().length > 0,
    initialData: initialNotes,
    refetchInterval: false,
  });

  return (
    <div className="p-2 text-white">
      <div className="py-2 px-10 md:px-[10%] lg:px-[25%]">
        <Link href="/notes/new" className="w-full  pb-5">
          <Button className="flex w-full flex-row items-center justify-center gap-4">
            New Note
          </Button>
        </Link>
      </div>

      <div className="px-10 md:px-[10%] lg:px-[20%]">
        <hr className="my-8 bg-gray-400 opacity-10" />
        <div className="mt-4 mb-8">
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

async function fetchNotes(searchString: string) {
  const res = await fetch(`/api/notes?search=${searchString}`);
  const json = await res.json();
  return json as Note[];
}
