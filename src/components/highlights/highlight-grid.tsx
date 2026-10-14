"use client";

import { useHighlightColumns } from "@/hooks/use-highlight-columns";
import type { HighlightGridProps } from "@/types/highlight";
import { HighlightCard } from "./highlight-card";
import { HighlightCardSkeleton } from "./highlight-card-skeleton";

const skeletonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const columnNames = ["first", "second", "third"];

export function HighlightGrid({
  highlights,
  isLoading = false,
  onRetry,
}: HighlightGridProps) {
  const columnCount = useHighlightColumns();

  // CSS sets the initial skeleton columns before the viewport hook hydrates.
  if (isLoading && highlights.length === 0) {
    return (
      <div
        aria-busy="true"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-3"
      >
        {skeletonIds.map((id) => (
          <HighlightCardSkeleton key={`skeleton-${id}`} />
        ))}
      </div>
    );
  }

  return (
    <div aria-busy={isLoading} className="flex items-start gap-4">
      {columnNames.slice(0, columnCount).map((name, columnIndex) => (
        <div
          key={name}
          className="flex min-w-0 flex-1 flex-col gap-6 md:gap-4 lg:gap-3"
        >
          {highlights
            .filter((_, index) => index % columnCount === columnIndex)
            .map((highlight, index) => (
              <HighlightCard
                key={highlight.clientId ?? highlight.id}
                highlight={highlight}
                eager={index === 0}
                onRetry={onRetry}
              />
            ))}
          {isLoading &&
            skeletonIds
              .filter(
                (_, index) =>
                  (highlights.length + index) % columnCount === columnIndex,
              )
              .map((id) => <HighlightCardSkeleton key={`skeleton-${id}`} />)}
        </div>
      ))}
    </div>
  );
}
