import Image from "next/image";

export function HighlightEmptyState() {
  return (
    <div role="status" className="flex flex-col items-center gap-4 py-12 text-center md:py-16">
      <Image
        src="/images/highlights-empty.svg"
        alt=""
        width={320}
        height={180}
        unoptimized
        className="h-auto w-64"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-base leading-5 font-semibold tracking-[-0.01em]">
          No highlights yet
        </h2>
        <p className="text-sm leading-normal tracking-[-0.0075em] text-black/60">
          Got a moment to share? Create your first highlight.
        </p>
      </div>
    </div>
  );
}
