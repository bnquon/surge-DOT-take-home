export function ImageSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="image-skeleton absolute inset-0 flex items-center justify-center overflow-hidden bg-[#f3f3f3]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 120 96"
        fill="none"
        className="relative w-24"
      >
        <rect
          x="26" y="14" width="68" height="64" rx="18"
          fill="white" stroke="#e5e5e5"
        />
        <rect
          x="33" y="28" width="48" height="36" rx="7"
          fill="#f3f3f3" stroke="#d4d4d4" strokeWidth="1.5"
          transform="rotate(-8 57 46)"
        />
        <rect
          x="39" y="34" width="48" height="36" rx="7"
          fill="white" stroke="#a3a3a3" strokeWidth="1.5"
        />
        <circle cx="76" cy="43" r="3.5" fill="#ec484b" />
        <path d="m44 63 10-12 9 8 6-6 13 12H44z" fill="#e5e5e5" />
        <path
          d="m44 63 10-12 9 8 6-6 13 12"
          stroke="#a3a3a3" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <g fill="#a3a3a3">
          <circle className="image-skeleton-dot" cx="50" cy="88" r="2" />
          <circle className="image-skeleton-dot" cx="60" cy="88" r="2" />
          <circle className="image-skeleton-dot" cx="70" cy="88" r="2" />
        </g>
      </svg>
    </div>
  );
}
