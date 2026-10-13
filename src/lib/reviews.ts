import type { Highlight, HighlightInput } from "@/types/highlight";

const reviewsApiUrl = "https://surgetakehome.vercel.app/api";

function getReviewUrl(endpoint: string): string {
  const apiId = process.env.SURGE_API_ID?.trim();
  if (!apiId) {
    throw new Error("The highlights API identifier isn't configured.");
  }

  return `${reviewsApiUrl}/${endpoint}/${encodeURIComponent(apiId)}`;
}

async function requestReviews(endpoint: string, options: RequestInit = {}) {
  const url = getReviewUrl(endpoint);
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("Couldn't reach the highlights service. Please try again.");
  }

  if (!response.ok) {
    throw new Error("The highlights request failed. Please try again.");
  }

  return response;
}

export async function getReviews(): Promise<Highlight[]> {
  const response = await requestReviews("getreviews");
  const reviews: Highlight[] = await response.json();

  if (!Array.isArray(reviews)) {
    throw new Error("The highlights service returned an invalid response.");
  }

  // The API has no timestamps; assume higher IDs are newer.
  return reviews.sort((first, second) => second.id - first.id);
}

export async function createReview(input: HighlightInput): Promise<void> {
  await requestReviews("postreview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
