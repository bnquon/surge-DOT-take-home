"use client";

import { useEffect, useState } from "react";
import { searchHighlightImage } from "@/lib/search-highlight-image";
import type { HighlightImageState } from "@/types/highlight";

export function useHighlightImage(query: string) {
  const [state, setState] = useState<HighlightImageState>({
    query,
    image: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    searchHighlightImage(query).then(
      (image) => {
        if (active) setState({ query, image, status: "ready" });
      },
      () => {
        if (active) setState({ query, image: null, status: "error" });
      },
    );

    return () => {
      active = false;
    };
  }, [query]);

  // Don't display the previous photo if the card's query changes.
  if (state.query !== query) {
    return { query, image: null, status: "loading" } satisfies HighlightImageState;
  }

  return state;
}
