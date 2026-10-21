// The SO viewfinder mark: camera frame corners (which double as code brackets), a drawn S and O, and the record light.
// Drawn paths, not type, so it matches the master files in Documents/brand/logo exactly.
export function Mark({ size = 36, title }: { size?: number; title?: string }) {
  return (
    <svg
      className="mark"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d="M8 32V8h24M88 8h24v24M112 88v24H88M32 112H8V88" stroke="currentColor" strokeWidth="7" strokeLinecap="square" />
      <path d="M50.66 41A10 10 0 1 0 42 56A10 10 0 1 1 33.34 71" stroke="currentColor" strokeWidth="10.5" />
      <circle cx="80" cy="56" r="14.75" stroke="currentColor" strokeWidth="10.5" />
      <circle className="mark-rec" cx="98" cy="22" r="6.5" fill="#ff3b30" />
    </svg>
  )
}
