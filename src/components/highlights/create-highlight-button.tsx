import type { CreateHighlightButtonProps } from "@/types/highlight";

export function CreateHighlightButton({ onClick }: CreateHighlightButtonProps) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className="highlight-button highlight-button-primary highlight-button-create fixed right-6 bottom-5 z-10 w-29.25 md:right-10 md:bottom-12.25 lg:right-20 lg:bottom-5.25"
    >
      Create
      <span aria-hidden="true" className="w-4 text-2xl leading-9">
        +
      </span>
    </button>
  );
}
