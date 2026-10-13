import { ImageSkeleton } from "./image-skeleton";

export function HighlightCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-w-0 flex-col gap-2 rounded-xl bg-white p-5 opacity-90 shadow-[inset_0_0_0_1px_#f3f3f3]"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <ImageSkeleton />
      </div>
      <div className="flex flex-col gap-1 motion-safe:animate-pulse">
        <div className="h-5 w-2/3 rounded bg-[#e5e5e5]" />
        <div className="h-3.5 w-1/3 rounded bg-[#e5e5e5]" />
      </div>
      <div className="flex h-15.75 flex-col justify-between py-0.75 motion-safe:animate-pulse">
        <div className="h-3.5 rounded bg-[#e5e5e5]" />
        <div className="h-3.5 rounded bg-[#e5e5e5]" />
        <div className="h-3.5 w-3/4 rounded bg-[#e5e5e5]" />
      </div>
    </div>
  );
}
