"use client";
import { useUnique } from "@/lib/client/hooks/useUnique";
import { Rng } from "@/lib/utils/rng";
import { useMemo } from "react";

export default function PostListSkeleton() {
  return (
    <div className="p-2">
      <div className="py-2 px-10 md:px-[10%] lg:px-[25%]">
        {/* Create New Button */}
        <div className="w-full animate-pulse rounded-lg bg-violet-300/30 p-5 shadow-lg"></div>
      </div>

      <div className="px-10 md:px-[10%] lg:px-[20%]">
        <hr className="my-8 bg-gray-400 opacity-10" />
        <div className="mt-4 mb-8 flex flex-col gap-2">
          {/* Tag Filter */}
          <div className="h-10 w-[120px] animate-pulse rounded-full bg-violet-300/30"></div>

          <div className="mt-2 h-12 w-full animate-pulse rounded-full bg-violet-300/30">
            {/* Search Input */}
          </div>
        </div>
        <PostListItemsSkeleton count={3} />
      </div>
    </div>
  );
}

interface PostListItemsSkeletonProps {
  count: number;
}

function PostListItemsSkeleton({ count }: PostListItemsSkeletonProps) {
  const range = useMemo(() => [...Array(count).keys()], [count]);
  const hash = useUnique(stringHash);
  const rng = new Rng(hash);

  return (
    <div>
      {range.map((idx) => (
        <PostItemItemSkeleton key={idx} rng={rng} />
      ))}
    </div>
  );
}

function PostItemItemSkeleton({ rng }: { rng: Rng }) {
  return (
    <div className="my-3 flex h-[130px] animate-pulse flex-col gap-3 rounded-xl bg-violet-300/30 px-6 py-4 shadow-md">
      <div className="h-5 w-32 animate-pulse rounded-md bg-violet-200/20"></div>
      <PostItemTitleSkeleton rng={rng} />
      <div className="flex flex-row gap-2">
        <div className="h-6 w-14 animate-pulse rounded-full bg-violet-200/50"></div>
        <div className="h-6 w-14 animate-pulse rounded-full bg-violet-200/50"></div>
        <div className="h-6 w-14 animate-pulse rounded-full bg-violet-200/50"></div>
        <div className="h-6 w-14 animate-pulse rounded-full bg-violet-200/50"></div>
      </div>
    </div>
  );
}

interface PostItemTitleSkeletonProps {
  rng?: Rng;
}

function PostItemTitleSkeleton({
  rng = new Rng(),
}: PostItemTitleSkeletonProps) {
  const widths = rng.shuffle(["w-20", "w-52", "w-16", "w-2/6"]);

  return (
    <div className="flex flex-row gap-2">
      <div
        className={`h-6 animate-pulse rounded-md bg-violet-200/20 ${widths[0]}`}
      ></div>
      <div
        className={`h-6 animate-pulse rounded-md bg-violet-200/20 ${widths[1]}`}
      ></div>
      <div
        className={`h-6 animate-pulse rounded-md bg-violet-200/20 ${widths[2]}`}
      ></div>
      <div
        className={`h-6 animate-pulse rounded-md bg-violet-200/20 ${widths[3]}`}
      ></div>
    </div>
  );
}

function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash &= hash; // Limit hash value to 32 bits
  }
  return hash;
}
