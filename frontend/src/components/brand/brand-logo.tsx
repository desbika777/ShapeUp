import { useId } from 'react';
import { cn } from '@/lib/cn';

type BrandLogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  subtitle?: string;
  markOnly?: boolean;
};

const sizeStyles = {
  sm: {
    gap: 'gap-3',
    mark: 'h-11 w-11',
    title: 'text-2xl',
    subtitle: 'text-xs',
  },
  md: {
    gap: 'gap-3.5',
    mark: 'h-12 w-12',
    title: 'text-[1.7rem]',
    subtitle: 'text-sm',
  },
  lg: {
    gap: 'gap-4',
    mark: 'h-14 w-14',
    title: 'text-[2rem]',
    subtitle: 'text-sm',
  },
} as const;

export function BrandMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const backgroundId = `${id}-background`;
  const glowId = `${id}-glow`;
  const monogramId = `${id}-monogram`;
  const stemId = `${id}-stem`;

  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={backgroundId} x1="24" y1="16" x2="136" y2="152" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10304F" />
          <stop offset="0.55" stopColor="#0F2740" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
        <radialGradient id={glowId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54 36) rotate(48) scale(92 84)">
          <stop stopColor="#6FF3E3" stopOpacity="0.6" />
          <stop offset="1" stopColor="#6FF3E3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={monogramId} x1="42" y1="28" x2="117" y2="131" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C9FFF6" />
        </linearGradient>
        <linearGradient id={stemId} x1="80" y1="22" x2="80" y2="138" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B8FFF5" />
          <stop offset="0.45" stopColor="#6FF3E3" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>

      <rect x="8" y="8" width="144" height="144" rx="38" fill={`url(#${backgroundId})`} />
      <rect x="12" y="12" width="136" height="136" rx="34" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="1.5" />
      <circle cx="58" cy="44" r="50" fill={`url(#${glowId})`} />
      <circle cx="124" cy="124" r="26" fill="#14B8A6" fillOpacity="0.12" />

      <path
        d="M80 24V136"
        stroke={`url(#${stemId})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M111 46C104 37 92 32 77 32C58 32 46 41 46 55C46 69 57 76 78 80C100 84 114 91 114 106C114 121 101 130 81 130C63 130 50 124 42 114"
        stroke={`url(#${monogramId})`}
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M53 45H107" stroke="#DFFFF8" strokeOpacity="0.28" strokeWidth="4" strokeLinecap="round" />
      <path d="M53 115H107" stroke="#DFFFF8" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function BrandLogo({
  className,
  size = 'md',
  theme = 'dark',
  subtitle,
  markOnly = false,
}: BrandLogoProps) {
  const styles = sizeStyles[size];
  const titleColor = theme === 'light' ? 'text-white' : 'text-slateblue';
  const accentColor = theme === 'light' ? 'text-mint' : 'text-teal';
  const subtitleColor = theme === 'light' ? 'text-white/68' : 'text-slate-500';

  return (
    <div className={cn('inline-flex items-center', styles.gap, className)}>
      <BrandMark className={cn('shrink-0', styles.mark)} />
      {!markOnly && (
        <div className="min-w-0">
          <p className={cn('font-display font-semibold leading-none tracking-[-0.04em]', styles.title, titleColor)}>
            <span>Shape</span>
            <span className={accentColor}>Up</span>
          </p>
          {subtitle ? (
            <p className={cn('mt-1 font-body font-medium tracking-[0.08em] uppercase', styles.subtitle, subtitleColor)}>{subtitle}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
