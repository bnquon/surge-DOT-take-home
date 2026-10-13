import type { UnsplashImageData } from "./unsplash";

export interface HighlightInput {
  title: string;
  location: string;
  description: string;
}

export interface Highlight extends HighlightInput {
  id: number;
}

export interface DisplayHighlight extends Highlight {
  clientId?: string;
  saveStatus?: "saving" | "failed";
  saveError?: string;
  hasSubmitted?: boolean;
}

export interface HighlightFormErrors {
  title?: string;
  location?: string;
  description?: string;
}

export interface ReviewsResponse {
  reviews: Highlight[];
}

export interface ReviewsErrorResponse {
  error: string;
  fieldErrors?: HighlightFormErrors;
}

export interface CreateHighlightButtonProps {
  onClick: () => void;
}

export interface CreateHighlightModalProps {
  onClose: () => void;
  onSubmit: (highlight: HighlightInput) => void;
}

export interface HighlightFieldProps {
  name: keyof HighlightInput;
  label: string;
  error?: string;
  multiline?: boolean;
  disabled?: boolean;
  onChange: () => void;
}

export interface HighlightCardProps {
  highlight: DisplayHighlight;
  eager?: boolean;
  onRetry?: (clientId: string) => void;
}

export interface HighlightDescriptionProps {
  description: string;
}

export interface HighlightSaveErrorProps {
  error?: string;
  onRetry?: () => void;
}

export interface HighlightImageProps {
  query: string;
  eager?: boolean;
}

export interface HighlightImageState {
  query: string;
  image: UnsplashImageData | null;
  status: "loading" | "ready" | "error";
}

export interface HighlightGridProps {
  highlights: DisplayHighlight[];
  isLoading?: boolean;
  onRetry?: (clientId: string) => void;
}
