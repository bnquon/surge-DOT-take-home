import type { HighlightSaveErrorProps } from "@/types/highlight";

export function HighlightSaveError({
  error,
  onRetry,
}: HighlightSaveErrorProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <p role="alert" className="text-xs leading-normal text-[#db272a]">
        {error || "Couldn't save your highlight. Please try again."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded text-xs leading-normal font-medium text-[#db272a] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec484b]"
        >
          Retry
        </button>
      )}
    </div>
  );
}
