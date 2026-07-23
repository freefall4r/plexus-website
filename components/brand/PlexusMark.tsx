/**
 * The Plexus mark — 12-fold mashrabiya star (M10), born in the Python logo lab.
 * Inherits its color from the surrounding text via currentColor.
 */
export function PlexusMark({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="-98 -98 196 196"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M 79.67,46 L 53.12,53.12 L 46,79.67 L 19.44,72.56 L 0,92 L -19.44,72.56 L -46,79.67 L -53.12,53.12 L -79.67,46 L -72.56,19.44 L -92,0 L -72.56,-19.44 L -79.67,-46 L -53.12,-53.12 L -46,-79.67 L -19.44,-72.56 L 0,-92 L 19.44,-72.56 L 46,-79.67 L 53.12,-53.12 L 79.67,-46 L 72.56,-19.44 L 92,0 L 72.56,19.44 L 79.67,46 Z M 49.4,-28.52 L 32.93,-32.93 L 28.52,-49.4 L 12.05,-44.99 L 0,-57.04 L -12.05,-44.99 L -28.52,-49.4 L -32.93,-32.93 L -49.4,-28.52 L -44.99,-12.05 L -57.04,0 L -44.99,12.05 L -49.4,28.52 L -32.93,32.93 L -28.52,49.4 L -12.05,44.99 L 0,57.04 L 12.05,44.99 L 28.52,49.4 L 32.93,32.93 L 49.4,28.52 L 44.99,12.05 L 57.04,0 L 44.99,-12.05 L 49.4,-28.52 Z"
      />
    </svg>
  );
}
