"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { HighlightDescriptionProps } from "@/types/highlight";

export function HighlightDescription({ description }: HighlightDescriptionProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const popoverId = useId();
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    let active = true;
    const measure = () => {
      if (active) {
        setIsOverflowing(Boolean(description) && text.scrollHeight > text.clientHeight + 1);
      }
    };
    const hide = (event: Event) => {
      // Scrolling the full description should keep its popover open.
      if (event.target instanceof Node && popoverRef.current?.contains(event.target)) {
        return;
      }
      popoverRef.current?.hidePopover();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(text);
    void document.fonts.ready.then(measure);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);

    return () => {
      active = false;
      observer.disconnect();
      clearTimeout(closeTimer.current);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [description]);

  function showPopover() {
    clearTimeout(closeTimer.current);
    const button = buttonRef.current;
    const popover = popoverRef.current;
    if (!button || !popover) return;

    const bounds = button.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 32);
    popover.style.width = `${width}px`;
    popover.showPopover();

    const height = popover.getBoundingClientRect().height;
    const fitsBelow = bounds.bottom + 8 + height <= window.innerHeight - 16;
    const centeredLeft = bounds.left + (bounds.width - width) / 2;
    popover.style.left = `${Math.max(16, Math.min(centeredLeft, window.innerWidth - width - 16))}px`;
    popover.style.top = `${Math.max(16, fitsBelow ? bounds.bottom + 8 : bounds.top - height - 8)}px`;
  }

  function scheduleClose() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (
        document.activeElement !== buttonRef.current &&
        !popoverRef.current?.contains(document.activeElement)
      ) {
        popoverRef.current?.hidePopover();
      }
    }, 150);
  }

  return (
    <div className="relative" onPointerLeave={scheduleClose}>
      <p
        ref={textRef}
        className="line-clamp-3 text-sm leading-normal tracking-[-0.0075em] wrap-anywhere"
      >
        {description}
      </p>
      {isOverflowing && (
        <>
          <button
            ref={buttonRef}
            type="button"
            aria-label="Read full description"
            aria-describedby={popoverId}
            popoverTarget={popoverId}
            popoverTargetAction="show"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") showPopover();
            }}
            onFocus={showPopover}
            onClick={showPopover}
            onBlur={(event) => {
              if (!popoverRef.current?.contains(event.relatedTarget)) {
                popoverRef.current?.hidePopover();
              }
            }}
            className="absolute inset-0 cursor-help rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec484b]"
          />
          <div
            ref={popoverRef}
            id={popoverId}
            popover="auto"
            role="tooltip"
            tabIndex={-1}
            onPointerEnter={() => clearTimeout(closeTimer.current)}
            className="highlight-description-popover fixed inset-auto m-0 max-h-[min(20rem,calc(100dvh-32px))] overflow-y-auto overscroll-contain rounded-xl border border-[#d4d4d4] bg-[#eeeeee] p-4 text-sm leading-normal tracking-[-0.0075em] whitespace-pre-wrap text-[#262626] shadow-lg wrap-anywhere"
          >
            {description}
          </div>
        </>
      )}
    </div>
  );
}
