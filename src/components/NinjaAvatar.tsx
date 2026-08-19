import type { Mood } from '../lib/today'

interface NinjaAvatarProps {
  mood: Mood
  size?: number
  className?: string
}

/**
 * The character. A chibi ninja bust styled after Tim's own "Sensei · Head
 * Ninja" mark — big expressive eyes carry the mood, not limb angles.
 * Happier and more energetic the closer today/this week track to the
 * identity you set; visibly deflated (never shamed) in DRIFT MODE per
 * section 9 — game-state feedback, not a verdict. SVG + CSS, no external
 * image assets, so it stays crisp and free to react instantly.
 */
export function NinjaAvatar({ mood, size = 92, className }: NinjaAvatarProps) {
  return (
    <div className={`ninja-avatar ninja-avatar--${mood}${className ? ` ${className}` : ''}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 110" width="100%" height="100%" role="img" aria-label={`Ninja avatar, ${mood}`}>
        <defs>
          <radialGradient id="hoodShade" cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#2b2e3c" />
            <stop offset="100%" stopColor="#131419" />
          </radialGradient>
          <linearGradient id="bandShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9366" />
            <stop offset="100%" stopColor="#e9551f" />
          </linearGradient>
        </defs>

        <g className="ninja-avatar__figure">
          {/* shoulders */}
          <path className="ninja-avatar__shoulders" d="M14 108C14 86 29 74 50 74C71 74 86 86 86 108Z" fill="#181a22" stroke="#2a2d3a" strokeWidth="1.5" />

          {/* head */}
          <ellipse cx="50" cy="45" rx="34" ry="36" fill="url(#hoodShade)" stroke="#2e3140" strokeWidth="1.5" />

          {/* headband tail, flutters */}
          <path className="ninja-avatar__tail" d="M79 26C92 20 102 27 99 38C96 47 85 47 78 40C74 35 74 30 79 26Z" fill="url(#bandShade)" />

          {/* headband */}
          <path d="M16.5 33C16.5 21 31 14 50 14C69 14 83.5 21 83.5 33C83.5 37.5 78 39.5 73.5 37C66 33 58 31 50 31C42 31 34 33 26.5 37C22 39.5 16.5 37.5 16.5 33Z" fill="url(#bandShade)" />
          <path d="M16.5 33c1.2-4.6 3.7-8.5 7.2-11.4l3 6.7c-2.7 2-4.9 4.5-6.4 7.5-2.2-.2-3.5-1.3-3.8-2.8Z" fill="#c8451a" opacity="0.6" />

          {/* eyebrows */}
          <path className="ninja-avatar__brow ninja-avatar__brow--left" d="M27 39L46 43.5" stroke="#101119" strokeWidth="3.6" strokeLinecap="round" />
          <path className="ninja-avatar__brow ninja-avatar__brow--right" d="M73 39L54 43.5" stroke="#101119" strokeWidth="3.6" strokeLinecap="round" />

          {/* eyes */}
          <g className="ninja-avatar__eyes">
            <ellipse cx="38" cy="51" rx="9.5" ry="10.5" fill="#f7f2e7" />
            <ellipse cx="62" cy="51" rx="9.5" ry="10.5" fill="#f7f2e7" />
            <circle cx="39" cy="52" r="6.2" fill="#c06a2e" />
            <circle cx="61" cy="52" r="6.2" fill="#c06a2e" />
            <circle cx="39" cy="52" r="3.1" fill="#14151c" />
            <circle cx="61" cy="52" r="3.1" fill="#14151c" />
            <circle cx="41.2" cy="48.6" r="1.5" fill="#fff" />
            <circle cx="63.2" cy="48.6" r="1.5" fill="#fff" />
          </g>
          <ellipse className="ninja-avatar__eyelid ninja-avatar__eyelid--left" cx="38" cy="47" rx="10" ry="7" fill="#131419" />
          <ellipse className="ninja-avatar__eyelid ninja-avatar__eyelid--right" cx="62" cy="47" rx="10" ry="7" fill="#131419" />
        </g>

        {mood === 'thriving' && (
          <>
            <g className="ninja-avatar__sparkles">
              <circle cx="10" cy="20" r="2" fill="var(--gold)" />
              <circle cx="90" cy="14" r="1.6" fill="var(--gold)" />
              <circle cx="94" cy="34" r="1.3" fill="var(--gold)" />
            </g>
            <circle className="ninja-avatar__fist" cx="88" cy="72" r="10" fill="#20232e" stroke="#2e3140" strokeWidth="1.5" />
          </>
        )}
      </svg>
    </div>
  )
}
