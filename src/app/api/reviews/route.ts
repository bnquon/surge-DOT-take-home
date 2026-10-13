import { createReview, getReviews } from "@/lib/reviews";
import { validateHighlight } from "@/lib/validate-highlight";
import type { HighlightInput } from "@/types/highlight";

export async function GET(): Promise<Response> {
  try {
    const reviews = await getReviews();
    return Response.json({ reviews });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Highlights are temporarily unavailable. Please try again.",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Please submit a valid highlight." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json(
      { error: "Please submit a valid highlight." },
      { status: 400 },
    );
  }

  const values = body as Record<string, unknown>;
  const input: HighlightInput = {
    title: typeof values.title === "string" ? values.title.trim() : "",
    location: typeof values.location === "string" ? values.location.trim() : "",
    description:
      typeof values.description === "string" ? values.description.trim() : "",
  };
  const fieldErrors = validateHighlight(input);
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { error: "Please check the required fields.", fieldErrors },
      { status: 400 },
    );
  }

  try {
    await createReview(input);
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Couldn't save your highlight. Please try again.",
      },
      { status: 502 },
    );
  }
}
