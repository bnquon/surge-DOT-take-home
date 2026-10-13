import type { HighlightFormErrors, HighlightInput } from "@/types/highlight";

export function validateHighlight(values: HighlightInput): HighlightFormErrors {
  const errors: HighlightFormErrors = {};

  if (!values.title.trim()) errors.title = "Please enter a highlight name.";
  if (!values.location.trim()) errors.location = "Please enter a location.";
  if (!values.description.trim()) {
    errors.description = "Please enter a description.";
  }

  return errors;
}
