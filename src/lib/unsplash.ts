import type {
  UnsplashImageData,
  UnsplashPhoto,
  UnsplashSearchResponse,
} from "@/types/unsplash";

const apiUrl = "https://api.unsplash.com";
export const maxImageQueryLength = 120;

export class UnsplashError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UnsplashError";
    this.status = status;
  }
}

async function fetchUnsplash<T>(url: URL): Promise<T> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new UnsplashError("Image search is not configured yet.", 503);
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (
        response.status === 429 ||
        (response.status === 403 &&
          response.headers.get("X-Ratelimit-Remaining") === "0")
      ) {
        throw new UnsplashError(
          "Image search has reached its limit. Please try again later.",
          429,
        );
      }

      throw new UnsplashError(
        "Image search is temporarily unavailable.",
        response.status === 401 || response.status === 403 ? 503 : 502,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof UnsplashError) throw error;
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new UnsplashError("Image search took too long. Please try again.", 504);
    }

    throw new UnsplashError("Image search is temporarily unavailable.", 502);
  }
}

function withAttribution(url: string): string {
  const attributionUrl = new URL(url);
  attributionUrl.searchParams.set("utm_source", "surge_highlights");
  attributionUrl.searchParams.set("utm_medium", "referral");
  return attributionUrl.toString();
}

function toImageData(photo: UnsplashPhoto): UnsplashImageData {
  try {
    // Keep Unsplash's ixid while hotlinking a crop sized for our card slots.
    const imageUrl = new URL(photo.urls.raw);
    imageUrl.searchParams.set("w", "800");
    imageUrl.searchParams.set("h", "450");
    imageUrl.searchParams.set("fit", "crop");
    imageUrl.searchParams.set("crop", "entropy");
    imageUrl.searchParams.set("auto", "format");
    imageUrl.searchParams.set("q", "80");

    return {
      id: photo.id,
      src: imageUrl.toString(),
      alt: photo.alt_description || photo.description || "Photo from Unsplash",
      photographer: photo.user.name,
      photographerUrl: withAttribution(photo.user.links.html),
      photoUrl: withAttribution(photo.links.html),
      downloadLocation: photo.links.download_location,
    };
  } catch {
    throw new UnsplashError("Image search returned an invalid photo.", 502);
  }
}

export async function searchUnsplash(query: string): Promise<UnsplashImageData> {
  const searchUrl = new URL("/search/photos", apiUrl);
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("per_page", "1");
  searchUrl.searchParams.set("orientation", "landscape");
  searchUrl.searchParams.set("content_filter", "high");

  const result = await fetchUnsplash<UnsplashSearchResponse>(searchUrl);
  if (!Array.isArray(result.results)) {
    throw new UnsplashError("Image search returned an invalid response.", 502);
  }

  let photo = result.results[0];
  if (!photo) {
    const fallbackUrl = new URL("/photos/random", apiUrl);
    fallbackUrl.searchParams.set("orientation", "landscape");
    fallbackUrl.searchParams.set("content_filter", "high");
    photo = await fetchUnsplash<UnsplashPhoto>(fallbackUrl);
  }

  return toImageData(photo);
}
