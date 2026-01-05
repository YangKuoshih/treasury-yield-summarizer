export function TYILogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#logoGradient)" opacity="0.08" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="url(#logoGradient)" strokeWidth="2.5" />
      <path
        d="M 28 78 Q 38 68, 48 62 T 68 50 T 88 32"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 78 32 L 88 32 L 88 42"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="78" r="3.5" fill="url(#logoGradient)" />
      <circle cx="48" cy="62" r="3.5" fill="url(#logoGradient)" />
      <circle cx="68" cy="50" r="3.5" fill="url(#logoGradient)" />
      <circle cx="88" cy="32" r="3.5" fill="url(#logoGradient)" />
    </svg>
  );
}
