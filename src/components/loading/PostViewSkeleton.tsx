export default function PostViewSkeleton() {
  return (
    <div className="container mx-auto px-10 md:px-20">
      <div className="flex flex-row justify-end py-2">
        <div className="flex flex-row gap-2">
          {/* Edit Button */}
          <div className="h-10 w-[100px] animate-pulse rounded-md bg-violet-300/30"></div>

          {/* Delete Button */}
          <div className="h-10 w-[100px] animate-pulse rounded-md bg-violet-300/30"></div>
        </div>
      </div>

      {/* Title */}
      <div className="h-12 w-full animate-pulse rounded-md bg-violet-300/30 py-2"></div>
      <hr className="mt-3 border-b-gray-500 opacity-50" />

      {/* Post Preview */}
      <PostPreviewLoading />
    </div>
  );
}

export function PostPreviewLoading() {
  return (
    <div className="py-4">
      <div className="h-[500px] w-full animate-pulse rounded-md bg-violet-300/30"></div>
    </div>
  );
}
