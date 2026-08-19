interface NinjaMarkProps {
  size?: number
  className?: string
}

/**
 * A small vector ninja mask mark for the rank avatar, styled after the
 * Ninja-360 brand mascot (black mask, orange headband, sharp eyes) rather
 * than a generic icon — until Phase 4 brings in real character-evolution
 * art. Vector instead of emoji so it stays crisp at avatar sizes.
 */
export function NinjaMark({ size = 40, className }: NinjaMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Ninja mark"
    >
      {/* hood / mask */}
      <path
        d="M24 3.5c11 0 19.5 8.7 19.5 19.7 0 9.6-6.8 16.9-16.6 19.9a5 5 0 0 1-3 0C14.3 40.1 4.5 32.8 4.5 23.2 4.5 12.2 13 3.5 24 3.5Z"
        fill="#181a22"
        stroke="#2e3140"
        strokeWidth="1.5"
      />
      {/* headband */}
      <path d="M4.8 17.2C7.7 9.2 15 3.5 24 3.5s16.3 5.7 19.2 13.7c-6-2.9-12.6-4.4-19.2-4.4S10.8 14.3 4.8 17.2Z" fill="var(--accent)" />
      <path d="M4.8 17.2c1.7-.8 3.4-1.5 5.2-2.1l1.2 4.4c-2 .6-3.9 1.4-5.7 2.3-.4-1.6-.6-3.1-.7-4.6Z" fill="var(--accent)" opacity="0.85" />
      {/* headband knot tail, flowing right like the reference */}
      <path d="M42 15.5c2.6 1.6 4 3.9 3.2 5.6-.8 1.7-3.6 1.9-6.2.3-1.7-1-2.9-2.5-3.2-3.9 2.1.1 4.2-.5 6.2-2Z" fill="var(--accent)" />
      {/* eyes */}
      <path d="M11 22.6c3-1.3 6.1-2 9.3-2.2l.2 3.6c-3 .2-5.9.9-8.7 2.1l-.8-3.5Z" fill="#f4ede1" />
      <path d="M37 22.6c-3-1.3-6.1-2-9.3-2.2l-.2 3.6c3 .2 5.9.9 8.7 2.1l.8-3.5Z" fill="#f4ede1" />
      <circle cx="16.4" cy="23.6" r="1.7" fill="#181a22" />
      <circle cx="31.6" cy="23.6" r="1.7" fill="#181a22" />
    </svg>
  )
}
