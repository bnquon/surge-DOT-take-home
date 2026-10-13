"use client";

import { type SubmitEvent, useEffect, useId, useRef, useState } from "react";
import { validateHighlight } from "@/lib/validate-highlight";
import type {
  CreateHighlightModalProps,
  HighlightFormErrors,
  HighlightInput,
} from "@/types/highlight";
import { HighlightField } from "./highlight-field";

export function CreateHighlightModal({
  onClose,
  onSubmit,
}: CreateHighlightModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [errors, setErrors] = useState<HighlightFormErrors>({});
  const [isClosing, setIsClosing] = useState(false);
  const submittedRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLInputElement>("input")?.focus();

    return () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, []);

  function closeModal() {
    if (closeTimer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    setIsClosing(true);
    // Fallback if the exit animation is interrupted or disabled mid-close.
    closeTimer.current = setTimeout(onClose, 220);
  }

  function clearError(name: keyof HighlightInput) {
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittedRef.current || closeTimer.current !== null) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: HighlightInput = {
      title: String(data.get("title") ?? "").trim(),
      location: String(data.get("location") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
    };
    const nextErrors = validateHighlight(values);
    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      const field = form.elements.namedItem(firstInvalidField);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    submittedRef.current = true;
    onSubmit(values);
    closeModal();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      data-closing={isClosing || undefined}
      className="create-highlight-dialog m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-24px)] max-w-87.5 overflow-y-auto overscroll-contain rounded-xl border-0 bg-white p-0 text-black md:max-w-120 lg:max-w-137.5"
      onCancel={(event) => {
        event.preventDefault();
        closeModal();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "dialog-exit") {
          onClose();
        }
      }}
    >
      <header className="flex h-17.75 items-center justify-between gap-4 border-b border-[#f3f3f3] px-6">
        <h2
          id={titleId}
          className="text-xl leading-[1.13] font-semibold tracking-[-0.01em]"
        >
          Create a highlight
        </h2>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={closeModal}
          className="-mr-1.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#525252] hover:bg-[#f3f3f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec484b]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="size-5"
          >
            <path
              d="m5 5 10 10M15 5 5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 px-6 py-10"
      >
        <HighlightField
          name="title"
          label="Highlight name"
          error={errors.title}
          onChange={() => clearError("title")}
        />
        <HighlightField
          name="location"
          label="Location"
          error={errors.location}
          onChange={() => clearError("location")}
        />
        <HighlightField
          name="description"
          label="Description"
          multiline
          error={errors.description}
          onChange={() => clearError("description")}
        />
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={closeModal}
            className="highlight-button w-23.25"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="highlight-button highlight-button-primary w-25.25"
          >
            Confirm
          </button>
        </div>
      </form>
    </dialog>
  );
}
