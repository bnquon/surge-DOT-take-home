"use client";

import { useEffect, useState } from "react";
import type { Highlight, ReviewsResponse } from "@/types/highlight";

export function useHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount triggers another request.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadHighlights() {
      try {
        const response = await fetch("/api/reviews", {
          cache: "no-store",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(15_000),
          ]),
        });
        if (!response.ok) throw new Error("Reviews request failed.");

        const data: ReviewsResponse = await response.json();
        if (!Array.isArray(data.reviews)) {
          throw new Error("Reviews response is invalid.");
        }

        if (active) setHighlights(data.reviews);
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error && error.name === "TimeoutError"
              ? "Loading highlights took too long. Please try again."
              : "Couldn't load highlights. Please try again.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadHighlights();

    return () => {
      active = false;
      controller.abort();
    };
  }, [retryCount]);

  function retry() {
    setError(null);
    setIsLoading(true);
    setRetryCount((current) => current + 1);
  }

  return { highlights, isLoading, error, retry };
}
