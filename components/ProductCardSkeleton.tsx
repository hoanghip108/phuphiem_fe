export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      {/* Image Skeleton */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="absolute inset-0 animate-pulse bg-gray-200">
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
        {/* Description */}
        <div className="mb-1 h-4 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="mb-3 h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
        {/* Price & Category */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
