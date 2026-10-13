import type { HighlightCardProps } from "@/types/highlight";
import { HighlightDescription } from "./highlight-description";
import { HighlightImage } from "./highlight-image";
import { HighlightSaveError } from "./highlight-save-error";

export function HighlightCard({ highlight, eager, onRetry }: HighlightCardProps) {
  const clientId = highlight.clientId;
  return (
    <article
      aria-busy={highlight.saveStatus === "saving"}
      className="highlight-card flex min-w-0 flex-col gap-2 rounded-xl bg-white p-5 opacity-90 shadow-[inset_0_0_0_1px_#f3f3f3]"
    >
      <HighlightImage query={highlight.title} eager={eager} />
      <div className="flex flex-col gap-1">
        <h2 className="text-base leading-5 font-semibold tracking-[-0.01em] wrap-anywhere">
          {highlight.title}
        </h2>
        <p className="text-sm leading-none tracking-[-0.0075em] text-black/60 wrap-anywhere">
          {highlight.location}
        </p>
      </div>
      <HighlightDescription description={highlight.description} />
      {highlight.saveStatus === "failed" && (
        <HighlightSaveError
          error={highlight.saveError}
          onRetry={
            clientId && onRetry
              ? () => onRetry(clientId)
              : undefined
          }
        />
      )}
    </article>
  );
}
