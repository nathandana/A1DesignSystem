const STROKE = "#1a0f07"

export function GameSceneIllustration() {
  return (
    <div className="cl-scene" aria-hidden="true">
      <svg viewBox="0 0 640 420" className="cl-scene__svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cl-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff4ea" />
            <stop offset="100%" stopColor="#f7e4d4" />
          </linearGradient>
          <linearGradient id="cl-floor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8c9a8" />
            <stop offset="100%" stopColor="#d8b48e" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="640" height="420" fill="url(#cl-wall)" />
        <rect x="0" y="300" width="640" height="120" fill="url(#cl-floor)" />
        <line x1="0" y1="300" x2="640" y2="300" stroke={STROKE} strokeWidth="4" />

        <rect x="40" y="70" width="120" height="230" rx="8" fill="#ffd8ec" stroke={STROKE} strokeWidth="4" />
        <path d="M52 90 C70 120 88 150 100 190 C112 230 118 260 124 290" stroke="#ff6eb8" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M148 90 C130 130 118 170 110 210 C104 245 100 275 96 295" stroke="#ff6eb8" strokeWidth="10" strokeLinecap="round" fill="none" />

        <g className="cl-scene__curtain-cat">
          <ellipse cx="100" cy="205" rx="22" ry="18" fill="#f5aa50" stroke={STROKE} strokeWidth="3" />
          <path d="M88 198 L82 186 L94 190 Z" fill="#f5aa50" stroke={STROKE} strokeWidth="2" />
          <path d="M112 198 L118 186 L106 190 Z" fill="#f5aa50" stroke={STROKE} strokeWidth="2" />
          <circle cx="94" cy="204" r="2.5" fill={STROKE} />
          <circle cx="106" cy="204" r="2.5" fill={STROKE} />
          <path d="M88 228 L84 250 L92 248 L96 232 Z" fill="#f5aa50" stroke={STROKE} strokeWidth="2" />
          <path d="M112 228 L116 250 L108 248 L104 232 Z" fill="#f5aa50" stroke={STROKE} strokeWidth="2" />
        </g>

        <rect x="470" y="120" width="140" height="180" rx="10" fill="#fff8f2" stroke={STROKE} strokeWidth="4" />
        <line x1="540" y1="120" x2="540" y2="300" stroke={STROKE} strokeWidth="3" />
        <circle cx="500" cy="210" r="6" fill="#ff8ec8" stroke={STROKE} strokeWidth="2" />
        <circle cx="580" cy="210" r="6" fill="#ff8ec8" stroke={STROKE} strokeWidth="2" />

        <g className="cl-scene__wall-cat">
          <ellipse cx="520" cy="88" rx="18" ry="16" fill="#c8ccd0" stroke={STROKE} strokeWidth="3" />
          <path d="M508 82 L502 72 L514 76 Z" fill="#c8ccd0" stroke={STROKE} strokeWidth="2" />
          <path d="M532 82 L538 72 L526 76 Z" fill="#c8ccd0" stroke={STROKE} strokeWidth="2" />
          <path d="M500 104 L494 126 L504 122 L508 108 Z" fill="#c8ccd0" stroke={STROKE} strokeWidth="2" />
          <path d="M540 104 L546 126 L536 122 L532 108 Z" fill="#c8ccd0" stroke={STROKE} strokeWidth="2" />
        </g>

        <rect x="250" y="228" width="180" height="18" rx="6" fill="#f0d8c0" stroke={STROKE} strokeWidth="3" />
        <rect x="248" y="246" width="12" height="54" fill="#d8b48e" stroke={STROKE} strokeWidth="3" />
        <rect x="418" y="246" width="12" height="54" fill="#d8b48e" stroke={STROKE} strokeWidth="3" />

        <g className="cl-scene__counter-cat">
          <ellipse cx="340" cy="214" rx="20" ry="16" fill="#ecd3b5" stroke={STROKE} strokeWidth="3" />
          <path d="M328 208 L322 198 L334 202 Z" fill="#ecd3b5" stroke={STROKE} strokeWidth="2" />
          <path d="M352 208 L358 198 L346 202 Z" fill="#ecd3b5" stroke={STROKE} strokeWidth="2" />
          <path d="M322 232 L318 248 L328 244 L332 230 Z" fill="#ecd3b5" stroke={STROKE} strokeWidth="2" />
          <path d="M358 232 L362 248 L352 244 L348 230 Z" fill="#ecd3b5" stroke={STROKE} strokeWidth="2" />
          <path d="M350 220 C360 210 372 214 378 224" stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>

        <rect x="300" y="252" width="8" height="14" rx="2" fill="#ff8ec8" stroke={STROKE} strokeWidth="2" transform="rotate(-18 304 259)" />
        <rect x="318" y="248" width="8" height="14" rx="2" fill="#ff8ec8" stroke={STROKE} strokeWidth="2" transform="rotate(12 322 255)" />

        <rect x="180" y="250" width="150" height="50" rx="16" fill="#ffcfe8" stroke={STROKE} strokeWidth="4" />
        <circle cx="220" cy="275" r="16" fill="#ffe8d8" stroke={STROKE} strokeWidth="3" />
        <path d="M206 268 Q220 258 234 268" stroke={STROKE} strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="220" cy="292" rx="24" ry="10" fill="#fff0e8" stroke={STROKE} strokeWidth="3" />

        <g className="cl-scene__alarm">
          <text x="360" y="282" fontSize="22" fontFamily="Baloo 2, sans-serif" fill={STROKE}>Zzz</text>
          <text x="388" y="262" fontSize="16" fontFamily="Baloo 2, sans-serif" fill={STROKE}>Zzz</text>
        </g>

        <g className="cl-scene__wake-cat">
          <ellipse cx="286" cy="236" rx="14" ry="12" fill="#f5aa50" stroke={STROKE} strokeWidth="3" />
          <path d="M276 232 L270 224 L280 226 Z" fill="#f5aa50" stroke={STROKE} strokeWidth="2" />
          <path d="M296 232 L302 224 L292 226 Z" fill="#f5aa50" stroke={STROKE} strokeWidth="2" />
          <path d="M304 240 L318 232" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
        </g>

        <g opacity="0.45">
          <text x="210" y="52" fontSize="14" fontFamily="Patrick Hand SC, cursive" fill={STROKE}>Climb curtains</text>
          <text x="470" y="108" fontSize="14" fontFamily="Patrick Hand SC, cursive" fill={STROKE}>Scale the wall</text>
          <text x="286" y="206" fontSize="14" fontFamily="Patrick Hand SC, cursive" fill={STROKE}>Counter patrol</text>
          <text x="318" y="246" fontSize="14" fontFamily="Patrick Hand SC, cursive" fill={STROKE}>Wake human</text>
        </g>
      </svg>
    </div>
  )
}
