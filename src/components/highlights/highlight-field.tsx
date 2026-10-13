import { useId } from "react";
import type { HighlightFieldProps } from "@/types/highlight";

export function HighlightField({
  name,
  label,
  error,
  multiline = false,
  disabled = false,
  onChange,
}: HighlightFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const controlProps = {
    id,
    name,
    required: true,
    disabled,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange,
    className:
      "highlight-field-control w-full rounded-lg border bg-white/60 px-3 text-sm leading-normal tracking-[-0.0075em] outline-none focus-visible:ring-2 focus-visible:ring-[#ec484b]/30 disabled:cursor-not-allowed disabled:opacity-60",
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex gap-1 text-sm leading-none font-medium tracking-[-0.0075em]"
      >
        {label}
        <span aria-hidden="true" className="text-[#ff0000]">
          *
        </span>
      </label>
      {multiline ? (
        <textarea
          {...controlProps}
          className={`${controlProps.className} h-33 min-h-33 resize-y py-3`}
        />
      ) : (
        <input
          {...controlProps}
          type="text"
          className={`${controlProps.className} h-11`}
        />
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs leading-normal text-[#db272a]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
