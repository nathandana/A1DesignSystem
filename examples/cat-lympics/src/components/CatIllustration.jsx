function darkenHex(hex, factor = 0.22) {
  if (!hex || hex.length < 7) return "#b08060"
  const h = hex.replace("#", "")
  const r = Math.max(0, Math.round(parseInt(h.slice(0, 2), 16) * (1 - factor)))
  const g = Math.max(0, Math.round(parseInt(h.slice(2, 4), 16) * (1 - factor)))
  const b = Math.max(0, Math.round(parseInt(h.slice(4, 6), 16) * (1 - factor)))
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

const BODY_PATH =
  "M56.4437 215.582C43.2437 173.582 61.4437 123.289 84.9437 98.5815C118.332 63.4769 172.444 69.3738 207.444 69.3738C242.444 69.3738 280.657 75.1662 308.444 105.874C336.23 136.582 336.444 239.582 317.444 265.082C384.441 368.472 394.883 437.199 385.991 482.582C406.991 485.582 447.644 505.081 422.444 559.081C390.944 626.581 258.944 629.581 260.444 586.081C250.844 587.281 224.444 583.081 221.444 566.581C190.244 594.181 157.444 578.081 146.444 566.581C144.944 574.581 132.644 588.181 95.4437 578.581C58.2437 568.981 79.9437 539.582 95.4437 526.082C67.8437 422.882 83.9437 312.081 95.4437 269.582C87.9437 269.082 69.6437 257.582 56.4437 215.582Z"

const LEFT_EAR_PATH =
  "M106.247 7.20858C120.647 3.60857 145.247 47.7086 155.747 70.2086C125.498 72.3747 91.1432 93.1111 77.7469 103.209C70.2469 82.2086 88.2469 11.7086 106.247 7.20858Z"

const RIGHT_EAR_PATH =
  "M282.501 6.20858C268.101 2.60857 243.501 46.7086 233.001 69.2086C263.25 71.3747 297.604 92.1111 311.001 102.209C318.501 81.2086 300.501 10.7086 282.501 6.20858Z"

const OUTLINE_PATH =
  "M146.444 566.581C144.944 574.581 132.644 588.181 95.4437 578.581C58.2437 568.981 79.9437 539.582 95.4437 526.082C67.8437 422.882 83.9437 312.082 95.4437 269.582C87.9437 269.082 69.6437 257.582 56.4437 215.582C43.2437 173.582 61.4437 123.289 84.9437 98.5815C118.332 63.4769 172.444 69.3738 207.444 69.3738C242.444 69.3738 280.657 75.1662 308.444 105.874C336.23 136.582 336.444 239.582 317.444 265.082C384.441 368.472 394.883 437.199 385.991 482.582M146.444 566.581C145.944 556.081 148.544 535.082 162.944 535.082C163.444 504.582 162.644 439.981 155.444 425.582M146.444 566.581C157.444 578.081 190.244 594.181 221.444 566.581M385.991 482.582C406.991 485.582 447.644 505.081 422.444 559.081C390.944 626.581 258.944 629.581 260.444 586.081M385.991 482.582C378.757 519.501 358.728 540.97 345.944 553.081C317.444 580.081 261.944 542.581 260.444 586.081M260.444 586.081C250.844 587.281 224.444 583.082 221.444 566.581M221.444 566.581C222.444 520.581 228.344 427.682 243.944 424.082"

const BODY_PATCHES = [
  "M220.001 72.5009L198.968 69.0009C193.905 110.866 198.968 123.001 210.108 123.001C219.02 123.001 220.845 87.4672 220.001 72.5009Z",
  "M251.444 76.5009L231.944 69.0009C226.944 103.501 231.944 113.501 242.944 113.501C251.744 113.501 252.277 88.8342 251.444 76.5009Z",
  "M183.444 76.5009L163.944 69.0009C158.944 103.501 163.944 113.501 174.944 113.501C183.744 113.501 184.277 88.8342 183.444 76.5009Z",
  "M343.001 311.501L326.501 283.501C304.501 310.501 247.401 315.601 265.001 332.001C282.601 348.401 324.334 325.168 343.001 311.501Z",
  "M367.355 369.197L353.323 338.325C324.901 361.789 260.942 357.416 277.942 376.818C294.943 396.221 344.634 379.822 367.355 369.197Z",
  "M81.8512 392.318L81.7115 361.302C108.753 378.751 151.437 364.648 145.887 385.422C140.337 406.196 100.884 398.675 81.8512 392.318Z",
  "M79.4522 445.137L81.9165 419.208C106.918 431.534 149.875 416.158 142.701 433.998C135.526 451.839 97.5457 448.857 79.4522 445.137Z",
  "M384.701 427.339L372.88 395.554C342.874 416.958 279.383 408.088 294.974 428.64C310.565 449.193 361.288 436.336 384.701 427.339Z",
  "M290.501 610.501V567.501L315.001 564.001L320.501 610.501H290.501Z",
  "M349.757 610.421L330.676 565.358L351.683 552.137L377.382 598.723L349.757 610.421Z",
  "M410.587 570.402L364.733 529.76L377.252 508.117L430.486 547.951L410.587 570.402Z",
]

export const DEFAULT_HERO_CAT = {
  id: "hero",
  baseColor: "#f5aa50",
  patternColor: "#c06018",
  pattern: "stripes",
  furLength: "short",
}

export function CatIllustration({ cat, action = "idle", className = "" }) {
  const uid = cat.id ?? "preview"
  const clipId = `cl-body-${uid}`
  const filterId = `cl-fur-${uid}`

  const patchColor = darkenHex(cat.baseColor, 0.22)
  const furWidth = cat.furLength === "long" ? 32 : cat.furLength === "medium" ? 14 : 0

  return (
    <div className={`cat-preview__wrap cat-preview__wrap--${action} ${className}`.trim()}>
      <svg
        viewBox="0 0 437 621"
        className="cat-preview__svg"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={BODY_PATH} />
          </clipPath>
          {cat.furLength !== "short" && (
            <filter id={filterId} x="-12%" y="-8%" width="124%" height="118%">
              <feGaussianBlur stdDeviation={cat.furLength === "long" ? 5 : 2.5} />
            </filter>
          )}
        </defs>

        <path
          d={LEFT_EAR_PATH}
          fill={patchColor}
          stroke="black"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={RIGHT_EAR_PATH}
          fill={patchColor}
          stroke="black"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {cat.furLength !== "short" && (
          <>
            <path
              d={BODY_PATH}
              fill={cat.baseColor}
              stroke={cat.baseColor}
              strokeWidth={furWidth}
              strokeLinejoin="round"
              filter={`url(#${filterId})`}
            />
            {cat.furLength === "long" && (
              <path
                d={BODY_PATH}
                fill="none"
                stroke={patchColor}
                strokeWidth="38"
                strokeDasharray="6 16"
                strokeLinecap="round"
                opacity="0.5"
              />
            )}
          </>
        )}

        <path d={BODY_PATH} fill={cat.baseColor} />

        {cat.pattern !== "none" && (
          <g clipPath={`url(#${clipId})`} opacity="0.82">
            {cat.pattern === "stripes" && (
              <>
                <path d="M65 308 Q218 288 372 308" stroke={cat.patternColor} strokeWidth="24" fill="none" strokeLinecap="round" />
                <path d="M60 382 Q218 362 378 382" stroke={cat.patternColor} strokeWidth="24" fill="none" strokeLinecap="round" />
                <path d="M62 452 Q218 434 375 452" stroke={cat.patternColor} strokeWidth="22" fill="none" strokeLinecap="round" />
                <path d="M66 516 Q218 502 368 516" stroke={cat.patternColor} strokeWidth="20" fill="none" strokeLinecap="round" />
              </>
            )}
            {cat.pattern === "spots" && (
              <>
                <circle cx="134" cy="308" r="22" fill={cat.patternColor} />
                <circle cx="298" cy="295" r="18" fill={cat.patternColor} />
                <circle cx="168" cy="386" r="24" fill={cat.patternColor} />
                <circle cx="272" cy="372" r="19" fill={cat.patternColor} />
                <circle cx="132" cy="462" r="17" fill={cat.patternColor} />
                <circle cx="306" cy="450" r="21" fill={cat.patternColor} />
                <circle cx="208" cy="428" r="14" fill={cat.patternColor} />
                <circle cx="220" cy="516" r="16" fill={cat.patternColor} />
              </>
            )}
          </g>
        )}

        <g clipPath={`url(#${clipId})`}>
          {BODY_PATCHES.map((d, i) => (
            <path key={i} d={d} fill={patchColor} />
          ))}
        </g>

        <ellipse cx="139.501" cy="171.709" rx="31.5" ry="37.5" fill="#FCDDEC" stroke="black" strokeWidth="12" />
        <ellipse cx="126.501" cy="172.501" rx="13.5" ry="22.5" fill="black" />
        <ellipse cx="256.501" cy="171.709" rx="31.5" ry="37.5" fill="#FCDDEC" stroke="black" strokeWidth="12" />
        <ellipse cx="240.501" cy="172.501" rx="13.5" ry="22.5" fill="black" />

        <path
          d="M173.001 246.501C180.001 247.001 197.701 243.109 196.501 228.709M196.501 228.709C195.501 234.709 206.101 247.701 220.501 246.501M196.501 228.709C177.001 217.501 164.902 211.746 185.001 207.709C193.501 206.001 203.001 206.501 210.001 207.709C217.001 208.916 223.501 209.501 196.501 228.709Z"
          stroke="black"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path d="M304.501 198.709L385.501 186.709M304.501 231.709L385.501 240.709" stroke="black" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M87.0008 228.709L6.0008 240.709M87.0008 195.709L6.00081 186.709" stroke="black" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

        <path
          d="M114.001 581.209C111.501 572.709 108.001 556.609 114.001 554.209M96.0008 576.709C93.5008 568.209 90.0008 552.109 96.0008 549.709M166.501 576.709C164.001 568.209 163.501 560.209 168.001 554.209M187.501 578.208C185.001 569.708 184.501 561.708 189.001 555.709M238.501 579.708C236.001 571.208 235.501 563.208 240.001 557.209M253.501 582.709C251.001 574.209 250.501 567.708 255.001 561.709"
          stroke="black"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={OUTLINE_PATH}
          stroke="black"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
