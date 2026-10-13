import {
  maxImageQueryLength,
  searchUnsplash,
  UnsplashError,
} from "@/lib/unsplash";

export async function GET(request: Request): Promise<Response> {
  const query = new URL(request.url).searchParams.get("q")?.trim();

  if (!query || query.length > maxImageQueryLength) {
    return Response.json(
      { error: `Enter a search query between 1 and ${maxImageQueryLength} characters.` },
      { status: 400 },
    );
  }

  try {
    const image = await searchUnsplash(query);
    return Response.json({ image });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof UnsplashError
            ? error.message
            : "Image search is temporarily unavailable.",
      },
      { status: error instanceof UnsplashError ? error.status : 502 },
    );
  }
}
