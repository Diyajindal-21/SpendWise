// SpendWiseLogo.jsx
export default function SpendWiseLogo(props:any) {
    return (
      <svg
        width="210"
        height="64"
        viewBox="0 0 210 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g>
          <circle cx="32" cy="32" r="24" fill="url(#bag-gradient)" />
          <path d="M32 14 L36 26 H28 L32 14Z" fill="#fff" opacity="0.15" />
          <ellipse cx="32" cy="36" rx="13" ry="10" fill="#181830" opacity="0.9" />
          <text x="32" y="41" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="18" fill="#5f5fff">
            $
          </text>
          <path d="M32 8 L32 14" stroke="#5f5fff" strokeWidth="2" strokeLinecap="round" />
        </g>
        <text
          x="62"
          y="44"
          fontFamily="Inter, Arial, sans-serif"
          fontWeight="700"
          fontSize="32"
          fill="url(#text-gradient)"
        >
          SpendWise
        </text>
        <defs>
          <linearGradient id="bag-gradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5f5fff" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="text-gradient" x1="62" y1="44" x2="200" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5f5fff" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  