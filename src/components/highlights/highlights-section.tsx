"use client";

import { useState } from "react";
import { useCreateHighlights } from "@/hooks/use-create-highlights";
import { useHighlights } from "@/hooks/use-highlights";
import type { HighlightInput } from "@/types/highlight";
import { CreateHighlightButton } from "./create-highlight-button";
import { CreateHighlightModal } from "./create-highlight-modal";
import { HighlightEmptyState } from "./highlight-empty-state";
import { HighlightGrid } from "./highlight-grid";
import { HighlightsHeader } from "./highlights-header";

export function HighlightsSection() {
  const { highlights, isLoading, error, retry } = useHighlights();
  const { createdHighlights, addHighlight, retryHighlight } = useCreateHighlights();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createdIds = new Set(createdHighlights.map((highlight) => highlight.id));
  const allHighlights = [
    ...createdHighlights,
    ...highlights.filter((highlight) => !createdIds.has(highlight.id)),
  ];

  function handleCreateHighlight(values: HighlightInput) {
    addHighlight(values);
  }

  return (
    <>
      <section
        aria-labelledby="highlights-heading"
        className="flex flex-col gap-6 md:gap-10"
      >
        <HighlightsHeader />
        {isLoading && (
          <p role="status" className="sr-only">
            Loading highlights…
          </p>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[#f3f3f3] bg-white p-5"
          >
            <p className="text-sm leading-normal text-black/80">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="highlight-button mt-3"
            >
              Retry
            </button>
          </div>
        )}
        {(isLoading || allHighlights.length > 0) && (
          <HighlightGrid
            highlights={allHighlights}
            isLoading={isLoading}
            onRetry={retryHighlight}
          />
        )}
        {!isLoading && !error && allHighlights.length === 0 && (
          <HighlightEmptyState />
        )}
      </section>
      <CreateHighlightButton onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <CreateHighlightModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateHighlight}
        />
      )}
    </>
  );
}
