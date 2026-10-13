"use client";

import Image from "next/image";
import { useState } from "react";
import { useHighlightImage } from "@/hooks/use-highlight-image";
import type { HighlightImageProps } from "@/types/highlight";
import { ImageSkeleton } from "./image-skeleton";

const fallbackSrc = "/images/highlight-placeholder.svg";

export function HighlightImage({
  query,
  eager = false,
}: HighlightImageProps) {
  const { image, status } = useHighlightImage(query);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const useFallback = !image || image.src === failedSrc;
  const src = useFallback ? fallbackSrc : image.src;
  const isLoading = status === "loading" || (!useFallback && loadedSrc !== src);

  return (
    <div
      aria-busy={isLoading}
      className="relative aspect-video overflow-hidden rounded-xl bg-[#f3f3f3]"
    >
      <Image
        src={src}
        alt={useFallback ? "" : image.alt}
        fill
        // Keep Unsplash photos on their CDN instead of proxying through Next.
        unoptimized
        // Eager loading the shared fallback avoids Next's shared-src LCP warning.
        loading={eager || useFallback ? "eager" : "lazy"}
        sizes="(min-width: 1024px) calc((100vw - 192px) / 3 - 40px), (min-width: 768px) calc((100vw - 96px) / 2 - 40px), calc(100vw - 88px)"
        className="object-cover object-center"
        onLoad={() => setLoadedSrc(src)}
        onError={() => {
          if (!useFallback) setFailedSrc(src);
        }}
      />
      {isLoading && <ImageSkeleton />}
      {!isLoading && useFallback && (
        <span className="sr-only">Image unavailable for {query}.</span>
      )}
    </div>
  );
}
