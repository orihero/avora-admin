/** Two overlapping curved shapes forming "M": darker blue (top-left), lighter blue (bottom-right). */
export function Logo({ showLabel = true }: { showLabel?: boolean }) {
  return (
    <div className="flex flex-shrink-0 items-center gap-3">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 flex-shrink-0"
        aria-hidden
      >
        <path
          d="M6 26V6l10 10 10-10v20"
          stroke="#1d4ed8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 26V6l10 10 10-10v20"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>
      {showLabel && (
        <span className="text-lg font-semibold text-black">Modernize</span>
      )}
    </div>
  )
}
