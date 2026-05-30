type ScreamTumblerVisualProps = {
  fillPercent: number;
  isListening: boolean;
  isUnlocked: boolean;
  showcasePercent?: number;
  finalDiscountPercent?: number;
};

const clampFill = (value: number): number => Math.min(100, Math.max(6, Math.round(value)));

const FILL_TOP = 46;
const FILL_BOTTOM = 214;

export const ScreamTumblerVisual = ({
  fillPercent,
  isListening,
  isUnlocked,
  showcasePercent,
  finalDiscountPercent
}: ScreamTumblerVisualProps) => {
  const level = clampFill(fillPercent);
  const fillRange = FILL_BOTTOM - FILL_TOP;
  const waterTop = FILL_BOTTOM - (fillRange * level) / 100;
  const waterHeight = FILL_BOTTOM - waterTop;

  const rootClassName = [
    'scream-tumbler',
    isListening ? 'scream-tumbler-listening' : '',
    isUnlocked ? 'scream-tumbler-unlocked' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="scream-tumbler-stage" aria-hidden="true">
      <div className={rootClassName}>
        <svg className="scream-tumbler-svg" viewBox="0 0 200 260" role="img" aria-label="Tumbler fill progress">
          <defs>
            <linearGradient id="screamCupShell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="45%" stopColor="#e9d5ff" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
            <linearGradient id="screamCupRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="screamCupWater" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="42%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="screamCupWaterUnlocked" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="40%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <clipPath id="screamCupInterior">
              <path d="M 52 208 L 52 176 L 36 142 L 36 50 Q 36 44 42 42 L 118 42 Q 124 44 124 50 L 124 142 L 108 176 L 108 208 Q 108 214 80 214 Q 52 214 52 208 Z" />
            </clipPath>
            <filter id="screamCupShadow" x="-20%" y="-10%" width="140%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#312e81" floodOpacity="0.22" />
            </filter>
          </defs>

          <ellipse className="scream-tumbler-ground" cx="80" cy="228" rx="46" ry="7" />

          <path
            className="scream-tumbler-handle"
            d="M 128 58 C 162 58 174 82 174 112 C 174 142 158 154 128 144"
            fill="none"
            stroke="url(#screamCupShell)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="scream-tumbler-handle-outline"
            d="M 128 58 C 162 58 174 82 174 112 C 174 142 158 154 128 144"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />

          <g filter="url(#screamCupShadow)">
            <path
              className="scream-tumbler-shell"
              d="M 48 210 L 48 174 L 30 140 L 30 48 Q 30 36 42 34 L 118 34 Q 130 36 130 48 L 130 140 L 112 174 L 112 210 Q 112 218 80 218 Q 48 218 48 210 Z"
              fill="url(#screamCupShell)"
              stroke="#c4b5fd"
              strokeWidth="1.5"
            />
          </g>

          <g clipPath="url(#screamCupInterior)">
            <rect
              className="scream-tumbler-water-fill"
              x="28"
              y={waterTop}
              width="144"
              height={waterHeight + 2}
              fill={isUnlocked ? 'url(#screamCupWaterUnlocked)' : 'url(#screamCupWater)'}
            />
            {level > 8 ? (
              <>
                <path
                  className="scream-tumbler-wave scream-tumbler-wave-a"
                  d={`M 28 ${waterTop + 6} Q 58 ${waterTop - 2} 88 ${waterTop + 6} T 148 ${waterTop + 6}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="3"
                />
                <path
                  className="scream-tumbler-wave scream-tumbler-wave-b"
                  d={`M 28 ${waterTop + 10} Q 68 ${waterTop + 16} 108 ${waterTop + 10} T 148 ${waterTop + 10}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="2"
                />
              </>
            ) : null}
            {isListening && level > 32 ? (
              <g className="scream-tumbler-bubbles">
                <circle cx="58" cy={waterTop + 28} r="2.2" fill="rgba(255,255,255,0.7)" />
                <circle cx="92" cy={waterTop + 18} r="1.6" fill="rgba(255,255,255,0.55)" />
                <circle cx="108" cy={waterTop + 36} r="1.3" fill="rgba(255,255,255,0.5)" />
              </g>
            ) : null}
          </g>

          <path
            className="scream-tumbler-shine"
            d="M 46 52 L 46 200"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.55"
          />

          <rect className="scream-tumbler-lid" x="34" y="24" width="92" height="14" rx="7" fill="url(#screamCupRim)" stroke="#94a3b8" strokeWidth="1" />
          <rect className="scream-tumbler-lid-dip" x="72" y="28" width="16" height="6" rx="3" fill="#64748b" opacity="0.35" />
          <rect className="scream-tumbler-straw" x="78" y="8" width="4" height="22" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.75" />

          <text className="scream-tumbler-brand" x="80" y="128" textAnchor="middle">
            DREAMY
          </text>
          <text className="scream-tumbler-brand scream-tumbler-brand-sub" x="80" y="142" textAnchor="middle">
            CLOUDS
          </text>
        </svg>
      </div>
      <p className="scream-tumbler-caption">
        {isUnlocked && finalDiscountPercent !== undefined
          ? `${finalDiscountPercent}% discount unlocked!`
          : isUnlocked
            ? 'Tumbler filled — offer unlocked!'
            : isListening
              ? 'Keep screaming to fill it up'
              : 'Start screaming to fill the tumbler'}
      </p>
      <p className="scream-tumbler-level">
        {isUnlocked && finalDiscountPercent !== undefined
          ? `${finalDiscountPercent}% OFF`
          : isUnlocked
            ? 'Unlocked'
            : showcasePercent !== undefined
              ? `Up to ${showcasePercent}%`
              : `${level}%`}
      </p>
    </div>
  );
};
