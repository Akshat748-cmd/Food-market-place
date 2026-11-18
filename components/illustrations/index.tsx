import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
  strokeColor?: string;
  accentColor?: string;
}

/**
 * Single-weight brown line-art illustration with warm golden yellow accents.
 */
export function ChefHatIllustration({
  className = '',
  size = 64,
  strokeColor = '#66523B',
  accentColor = '#F8C45C',
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Golden soft accent glow */}
      <circle cx="32" cy="28" r="18" fill={accentColor} fillOpacity="0.18" />
      
      {/* Chef Hat Puffs */}
      <path
        d="M20 34C17.5 32 16 28 16 24C16 18.5 20.5 14 26 14C27.2 14 28.3 14.3 29.3 14.8C30.8 11.9 33.7 10 37 10C41.4 10 45 13.6 45 18C45 18.7 44.9 19.4 44.7 20C47.8 21.2 50 24.3 50 28C50 32.5 46.5 36 42 36"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hat Base Band */}
      <rect
        x="19"
        y="36"
        width="26"
        height="12"
        rx="3"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2.2"
      />
      {/* Vertical pleat lines */}
      <path
        d="M26 36V48M32 36V48M38 36V48"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Accent dot */}
      <circle cx="32" cy="24" r="3" fill={accentColor} />
    </svg>
  );
}

export function VegetableBasketIllustration({
  className = '',
  size = 80,
  strokeColor = '#66523B',
  accentColor = '#F8C45C',
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Accent warm aura */}
      <ellipse cx="40" cy="42" rx="26" ry="16" fill={accentColor} fillOpacity="0.2" />
      
      {/* Vegetables peeking out */}
      {/* Carrot */}
      <path
        d="M26 36L20 22M20 22L16 20M20 22L18 26M20 22L24 20"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="34" r="5" fill="#EAF3ED" stroke={strokeColor} strokeWidth="2" />
      {/* Tomato / Apple */}
      <circle cx="39" cy="32" r="7" fill={accentColor} fillOpacity="0.4" stroke={strokeColor} strokeWidth="2" />
      <path d="M39 25V22M37 23C39 21 41 21 43 23" stroke="#315B42" strokeWidth="2" strokeLinecap="round" />
      
      {/* Broccoli / Greens */}
      <path
        d="M48 34C48 30 52 28 55 30C58 29 61 32 60 35"
        stroke="#315B42"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Woven Basket body */}
      <path
        d="M18 38H62L56 64H24L18 38Z"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Basket handle */}
      <path
        d="M26 38C26 24 54 24 54 38"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Basket Weave lines */}
      <path
        d="M21 46H59M23 54H57M33 38L30 64M40 38V64M47 38L50 64"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GroceryBagIllustration({
  className = '',
  size = 80,
  strokeColor = '#66523B',
  accentColor = '#F8C45C',
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="40" cy="45" r="24" fill={accentColor} fillOpacity="0.16" />
      
      {/* Bread baguette and greens emerging */}
      <rect
        x="30"
        y="12"
        width="8"
        height="32"
        rx="4"
        transform="rotate(-15 30 12)"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2"
      />
      <path d="M48 24C48 18 54 18 56 22" stroke="#315B42" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M52 26C54 20 60 21 61 25" stroke="#315B42" strokeWidth="2.2" strokeLinecap="round" />

      {/* Paper Bag */}
      <path
        d="M22 32H58L54 68H26L22 32Z"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Bag serrated top cut */}
      <path
        d="M22 32L26 35L30 32L34 35L38 32L42 35L46 32L50 35L54 32L58 35"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Golden logo / badge on bag */}
      <circle cx="40" cy="50" r="7" fill={accentColor} stroke={strokeColor} strokeWidth="1.8" />
      <path d="M37 50L39 52L43 48" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ServingTrayIllustration({
  className = '',
  size = 80,
  strokeColor = '#66523B',
  accentColor = '#F8C45C',
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="40" cy="38" r="22" fill={accentColor} fillOpacity="0.18" />
      
      {/* Cloche Dome */}
      <path
        d="M18 46C18 30 28 20 40 20C52 20 62 30 62 46H18Z"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Dome Top Knob */}
      <circle cx="40" cy="17" r="3.5" fill={accentColor} stroke={strokeColor} strokeWidth="2" />
      
      {/* Steam Auras */}
      <path
        d="M34 12C34 8 36 6 36 4M44 12C44 8 42 6 42 4"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Platter Base */}
      <path
        d="M12 46H68C70 46 71 48 69 50L64 56C63 57 61 58 59 58H21C19 58 17 57 16 56L11 50C9 48 10 46 12 46Z"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Hand line holding platter */}
      <path
        d="M32 64C36 67 44 67 48 64"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuCardIllustration({
  className = '',
  size = 80,
  strokeColor = '#66523B',
  accentColor = '#F8C45C',
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="42" cy="40" r="25" fill={accentColor} fillOpacity="0.18" />
      
      {/* Back card */}
      <rect
        x="30"
        y="14"
        width="34"
        height="50"
        rx="4"
        fill="#F1E8D8"
        stroke={strokeColor}
        strokeWidth="2"
      />
      {/* Front card */}
      <rect
        x="18"
        y="20"
        width="36"
        height="52"
        rx="4"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2.4"
      />
      {/* Menu Header Ornament */}
      <path d="M26 30H46" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
      {/* Text lines */}
      <path d="M26 38H42M26 44H40M26 50H44M26 58H36" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
      {/* Price marks */}
      <circle cx="48" cy="38" r="1.5" fill={strokeColor} />
      <circle cx="48" cy="44" r="1.5" fill={strokeColor} />
      <circle cx="48" cy="50" r="1.5" fill={strokeColor} />
    </svg>
  );
}

export function ChefIllustration({
  className = '',
  size = 90,
  strokeColor = '#66523B',
  accentColor = '#F8C45C',
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="45" cy="45" r="32" fill={accentColor} fillOpacity="0.16" />
      
      {/* Chef Hat */}
      <path
        d="M32 30C28 28 28 23 31 20C31 16 36 13 41 14C43 11 48 11 51 13C56 12 60 16 59 20C62 23 61 28 58 30"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="33" y="30" width="24" height="6" rx="2" fill="#FFF9EF" stroke={strokeColor} strokeWidth="2" />

      {/* Face & Head */}
      <path
        d="M35 36C35 44 55 44 55 36"
        stroke={strokeColor}
        strokeWidth="2"
      />
      {/* Smiling eyes */}
      <path d="M39 39C40 38 42 38 43 39M47 39C48 38 50 38 51 39" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      {/* Cheerful smile */}
      <path d="M42 43C43 45 47 45 48 43" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
      {/* Chef coat & neckerchief */}
      <path
        d="M26 68L30 46H60L64 68"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Golden neckerchief */}
      <path
        d="M41 46L45 52L49 46"
        fill={accentColor}
        stroke={strokeColor}
        strokeWidth="2"
      />
      {/* Double-breasted coat buttons */}
      <circle cx="41" cy="56" r="1.5" fill={strokeColor} />
      <circle cx="49" cy="56" r="1.5" fill={strokeColor} />
      <circle cx="41" cy="62" r="1.5" fill={strokeColor} />
      <circle cx="49" cy="62" r="1.5" fill={strokeColor} />
    </svg>
  );
}

export function WaiterIllustration({
  className = '',
  size = 90,
  strokeColor = '#66523B',
  accentColor = '#F8C45C',
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="45" cy="45" r="32" fill={accentColor} fillOpacity="0.16" />
      
      {/* Hair & head */}
      <path
        d="M35 25C37 20 53 20 55 25C57 28 56 34 54 36C50 42 40 42 36 36C34 33 33 28 35 25Z"
        fill="#FFF9EF"
        stroke={strokeColor}
        strokeWidth="2.2"
      />
      {/* Neat Hair wave */}
      <path d="M35 25C38 21 44 21 47 24C49 22 53 22 55 25" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" />
      {/* Smile & glasses/eyes */}
      <path d="M40 31C41 30 43 30 44 31M46 31C47 30 49 30 50 31" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M42 36C44 38 46 38 48 36" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />

      {/* Vest & Bowtie */}
      <path
        d="M28 68L34 44H56L62 68"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Golden Bowtie */}
      <path
        d="M42 44L45 46L48 44L45 42L42 44Z"
        fill={accentColor}
        stroke={strokeColor}
        strokeWidth="1.8"
      />
      {/* Serving hand with tray */}
      <path
        d="M58 54L68 50M62 48H74"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Avatar matching the exact hero floating assistant illustration:
 * line art face with round spectacles, hair bun, warm brown strokes and golden aura.
 */
export function HeroAvatarIllustration({
  size = 56,
  showOnlineDot = true,
  expression = 'neutral',
  className = '',
}: {
  size?: number;
  showOnlineDot?: boolean;
  expression?: 'neutral' | 'happy' | 'thinking' | 'alert';
  className?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Warm Yellow Background Circle */}
        <circle cx="32" cy="32" r="30" fill="#F8C45C" fillOpacity="0.35" stroke="#F8C45C" strokeWidth="1.5" />

        {/* Hair Bun at top-right */}
        <circle cx="44" cy="20" r="8" fill="#66523B" />

        {/* Neck */}
        <path d="M29 44V51M35 44V51" stroke="#66523B" strokeWidth="2.2" strokeLinecap="round" />

        {/* Collar / Shoulder */}
        <path
          d="M20 58C23 52 28 50 32 50C36 50 41 52 44 58"
          stroke="#66523B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Head Shape */}
        <path
          d="M24 33C24 40 32 44 32 44C32 44 40 40 40 33V27C40 22 36 21 32 21C28 21 24 22 24 27V33Z"
          fill="#FFF9EF"
          stroke="#66523B"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Hair Bangs */}
        <path
          d="M24 27C27 24 31 23 35 24C38 23 40 25 40 28"
          stroke="#66523B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Round Spectacles */}
        <circle cx="28.5" cy="31.5" r="4.2" stroke="#66523B" strokeWidth="1.8" fill="none" />
        <circle cx="35.5" cy="31.5" r="4.2" stroke="#66523B" strokeWidth="1.8" fill="none" />
        <path d="M32.7 31.5H31.3" stroke="#66523B" strokeWidth="1.8" />

        {/* Eyes inside glasses */}
        <circle cx="28.5" cy="31.5" r="1.2" fill="#66523B" />
        <circle cx="35.5" cy="31.5" r="1.2" fill="#66523B" />

        {/* Expression-dependent mouth & eyebrows */}
        {expression === 'happy' && (
          <>
            <path d="M26.5 25.5C28 24.5 30 25 30.5 25.5M33.5 25.5C34 25 36 24.5 37.5 25.5" stroke="#66523B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M30 38C31 39.5 33 39.5 34 38" stroke="#66523B" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}
        {expression === 'thinking' && (
          <>
            <path d="M26.5 24.5L30 26M33.5 25.5L37 24" stroke="#66523B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M30 38.5H34" stroke="#66523B" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}
        {expression === 'alert' && (
          <>
            <path d="M26.5 24L30 25M34 25L37.5 24" stroke="#66523B" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="32" cy="38.5" r="1.5" stroke="#66523B" strokeWidth="1.5" />
          </>
        )}
        {expression === 'neutral' && (
          <>
            <path d="M27 25C28 24.5 29.5 24.5 30.5 25M33.5 25C34.5 24.5 36 24.5 37 25" stroke="#66523B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M30 38C31 39 33 39 34 38" stroke="#66523B" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}
      </svg>

      {/* Online indicator dot (as in hero screenshot) */}
      {showOnlineDot && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-[#22C55E]"
          style={{
            width: Math.max(10, size * 0.22),
            height: Math.max(10, size * 0.22),
          }}
        />
      )}
    </div>
  );
}
