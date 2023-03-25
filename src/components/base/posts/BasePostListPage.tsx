"use client";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import SearchInput from "@/components/SearchInput";
import TagFilter, { SelectedTag } from "@/components/TagFilter";
import { useDebounce } from "@/lib/client/hooks/useDebounce";
import { Post } from "@/lib/server/schemas/Post";
import { PageResult } from "@/lib/utils/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "react-query";
import Button from "../../Button";
import PostList from "../../PostList";

export interface BasePostListPage {
  initialPosts: PageResult<Post>;
}

export default function BasePostsListPage({ initialPosts }: BasePostListPage) {
  const router = useRouter();
  const [searchString, setSearchString] = useState("");
  const search = useDebounce(searchString, 500);
  const queryClient = useQueryClient();
  const [searchTags, setSearchTags] = useState<SelectedTag[]>([]);
  const { ref, inView } = useInView();

  const handleChangeTagFilter = (tags: SelectedTag[]) => {
    setSearchTags(tags);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchString(value);
    router.refresh();
  };

  const {
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(["posts", search, searchTags], {
    initialData: {
      pageParams: [initialPosts.nextId],
      pages: [initialPosts],
    },
    queryFn({ pageParam = "" }) {
      return fetchPosts({
        searchString: search,
        tags: searchTags,
        cursor: pageParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId,
  });

  useEffect(() => {
    if (search.trim().length === 0 && searchTags.length === 0) {
      return;
    }

    const refetchPage = async () => {
      if (search.trim().length > 0 || searchTags.length > 0) {
        const newPage = await fetchPosts({
          searchString: search,
          tags: searchTags,
        });

        queryClient.setQueriesData(["posts"], {
          pages: [newPage],
          pageParams: [newPage.nextId],
        });
      }
    };

    void refetchPage();
  }, [queryClient, refetch, search, searchTags]);

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  const posts = useMemo(() => {
    const pages = data?.pages;
    if (!pages) {
      return [];
    }

    return pages.reduce((prev, page) => [...prev, ...page.data], [] as Post[]);
  }, [data]);

  return (
    <div className="p-2 text-white">
      <div className="py-2 px-10 md:px-[10%] lg:px-[25%]">
        <NewPostButton />
      </div>

      <div className="px-2 md:px-[10%] lg:px-[20%]">
        <hr className="my-8 bg-gray-400 opacity-10" />
        <div className="mt-4 mb-8 flex flex-col gap-2">
          <TagFilter
            onChange={handleChangeTagFilter}
            selectedTags={searchTags}
          />
          <SearchInput value={searchString} onInput={handleSearchChange} />
        </div>
        {isLoading ? (
          <div className="my-20">
            <LoadingSpinner
              size={60}
              width={5}
              color="rgba(255, 255, 255, 0.2)"
            />
          </div>
        ) : (
          <>
            <PostList posts={posts} />

            {isFetchingNextPage && (
              <div className="flex w-full flex-row justify-center">
                <LoadingSpinner />
              </div>
            )}

            {hasNextPage && (
              <span ref={ref} className="invisible">
                marker
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function NewPostButton() {
  return (
    <Link href="/posts/new" className="w-full pb-5">
      <Button variant="accent" className="w-full font-bold">
        New Post
      </Button>
    </Link>
  );
}

interface FetchPostsOptions {
  searchString: string;
  tags: SelectedTag[];
  cursor?: string;
}
async function fetchPosts(options: FetchPostsOptions) {
  const { searchString, tags, cursor } = options;
  const searchParams = new URLSearchParams();

  if (searchString.trim().length > 0) {
    searchParams.set("search", searchString);
  }

  if (tags.length > 0) {
    tags.forEach((t) => searchParams.append("tags", t.name));
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const queryString = searchParams.toString();
  const q = queryString.length > 0 ? `?${queryString}` : "";

  const res = await fetch(`/api/posts${q}`);
  const json = await res.json();
  return json as PageResult<Post>;
}
