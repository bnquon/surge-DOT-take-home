import type {
  Highlight,
  HighlightFormErrors,
  HighlightInput,
  ReviewsErrorResponse,
  ReviewsResponse,
} from "@/types/highlight";

export class CreateHighlightError extends Error {
  readonly fieldErrors?: HighlightFormErrors;

  constructor(message: string, fieldErrors?: HighlightFormErrors) {
    super(message);
    this.name = "CreateHighlightError";
    this.fieldErrors = fieldErrors;
  }
}

export async function createHighlight(values: HighlightInput): Promise<void> {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    signal: AbortSignal.timeout(25_000),
  }).catch(() => {
    throw new CreateHighlightError(
      "Couldn't reach the highlights service. Please try again.",
    );
  });
  if (response.ok) return;

  const data: ReviewsErrorResponse = await response.json().catch(() => ({
    error: "Couldn't save your highlight. Please try again.",
  }));
  throw new CreateHighlightError(data.error, data.fieldErrors);
}

export async function getCreatedHighlight(
  values: HighlightInput,
): Promise<Highlight> {
  try {
    const response = await fetch("/api/reviews", {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error("Review confirmation failed.");

    const data: ReviewsResponse = await response.json();
    const review = data.reviews.find(
      (review) =>
        review.title === values.title &&
        review.location === values.location &&
        review.description === values.description,
    );
    if (!review) throw new Error("Saved review wasn't found.");
    return review;
  } catch {
    throw new CreateHighlightError(
      "Your highlight was saved, but we couldn't load it. Please try again.",
    );
  }
}
