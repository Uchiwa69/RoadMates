// Logo RoadMates : un soleil couchant sur la route.
export default function Logo({ taille = 32 }) {
  return (
    <span className="logo-marque">
      <svg width={taille} height={taille} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="logo-ciel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF9F45" />
            <stop offset=".55" stopColor="#F2558C" />
            <stop offset="1" stopColor="#6B3FD1" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="14" fill="url(#logo-ciel)" />
        <circle cx="24" cy="27" r="10" fill="#FFF1E8" />
        <rect x="6" y="27" width="36" height="15" fill="#1E1236" opacity=".9" />
        <path d="M24 30 L20 42 h8 z" fill="#FF9F45" />
      </svg>
      <span className="logo-texte">RoadMates</span>
    </span>
  )
}
