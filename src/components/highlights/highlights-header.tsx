export function HighlightsHeader() {
  return (
    <header className="flex flex-col gap-4 md:max-w-150 lg:max-w-165">
      <div className="flex flex-col gap-2">
        <p className="text-xs leading-tight font-semibold tracking-[-0.01em] text-[#cf3538]">
          HIGHLIGHTS
        </p>
        <h1
          id="highlights-heading"
          className="text-[29px] leading-[1.13] font-semibold tracking-[-0.015em]"
        >
          What are the special moments of your life?
        </h1>
      </div>
      <p className="text-base leading-6 tracking-[-0.0075em] text-black/80 md:max-w-125 lg:max-w-none">
        We believe every moment counts! Share your favorite highlights,
        unforgettable memories, and the stories that make your life shine.
      </p>
    </header>
  );
}
