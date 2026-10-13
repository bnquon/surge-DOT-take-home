"use client";

import { useRef, useState } from "react";
import {
  CreateHighlightError,
  createHighlight,
  getCreatedHighlight,
} from "@/lib/create-highlight";
import type { DisplayHighlight, HighlightInput } from "@/types/highlight";

export function useCreateHighlights() {
  const [createdHighlights, setCreatedHighlights] = useState<DisplayHighlight[]>([]);
  const nextTemporaryId = useRef(-1);
  const pendingClientIds = useRef(new Set<string>());
  const saveQueue = useRef(Promise.resolve());

  function saveHighlight(highlight: DisplayHighlight) {
    const clientId = highlight.clientId;
    if (!clientId || pendingClientIds.current.has(clientId)) return;
    pendingClientIds.current.add(clientId);

    setCreatedHighlights((current) =>
      current.map((item) =>
        item.clientId === clientId
          ? { ...item, saveStatus: "saving", saveError: undefined }
          : item,
      ),
    );

    // Queue saves so identical submissions can confirm their own review.
    saveQueue.current = saveQueue.current.then(async () => {
      let hasSubmitted = Boolean(highlight.hasSubmitted);
      try {
        const values: HighlightInput = {
          title: highlight.title,
          location: highlight.location,
          description: highlight.description,
        };
        // A successful POST only needs GET confirmation on subsequent retries.
        if (!hasSubmitted) {
          await createHighlight(values);
          hasSubmitted = true;
        }
        const review = await getCreatedHighlight(values);
        setCreatedHighlights((current) =>
          current.map((item) =>
            item.clientId === clientId ? { ...review, clientId } : item,
          ),
        );
      } catch (error) {
        setCreatedHighlights((current) =>
          current.map((item) =>
            item.clientId === clientId
              ? {
                  ...item,
                  saveStatus: "failed",
                  hasSubmitted,
                  saveError:
                    error instanceof CreateHighlightError
                      ? error.message
                      : "Couldn't save your highlight. Please try again.",
                }
              : item,
          ),
        );
      } finally {
        pendingClientIds.current.delete(clientId);
      }
    });
  }

  function addHighlight(values: HighlightInput) {
    const highlight: DisplayHighlight = {
      ...values,
      id: nextTemporaryId.current--,
      clientId: crypto.randomUUID(),
      saveStatus: "saving",
    };
    setCreatedHighlights((current) => [highlight, ...current]);
    saveHighlight(highlight);
  }

  function retryHighlight(clientId: string) {
    const highlight = createdHighlights.find((item) => item.clientId === clientId);
    if (highlight?.saveStatus === "failed") saveHighlight(highlight);
  }

  return { createdHighlights, addHighlight, retryHighlight };
}
