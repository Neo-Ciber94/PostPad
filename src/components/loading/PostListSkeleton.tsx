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

          <div className="h-12 mt-2 w-full animate-pulse rounded-full bg-violet-300/30">
            {/* Search Input */}
          </div>
        </div>
        {/* TODO: <PostList posts={posts} /> */}
      </div>
    </div>
  );
}
