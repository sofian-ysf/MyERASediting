'use client'

// Color palettes for SVG backgrounds - ERAS themed
const colorPalettes = [
  '#C4B5A0', // Beige
  '#A89A91', // Taupe
  '#C8B8D8', // Lavender
  '#A8C1A8', // Sage green
  '#D4A5A5', // Dusty rose
  '#9AB5D1', // Powder blue
  '#E6C9A8', // Peach
  '#B5C9C3', // Mint
  '#D1B3C4', // Blush
  '#A8B8A8', // Eucalyptus
]

// Stroke colors that contrast well with each background
const strokeColors = [
  '#7A6B4F', // Darker beige
  '#6B5D54', // Darker taupe
  '#8B7A9B', // Darker lavender
  '#5A7A5A', // Darker sage
  '#A67373', // Darker rose
  '#5A7A9A', // Darker blue
  '#C69A6A', // Darker peach
  '#7A9A8F', // Darker mint
  '#9A7A8A', // Darker blush
  '#6A7A6A', // Darker eucalyptus
]

// SVG patterns - medical/professional themed
const svgPatterns = [
  // Pattern 1: Stethoscope inspired
  (color: string) => (
    <>
      <circle cx="100" cy="100" r="25" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="15" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M100 75 L100 55" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="50" r="5" fill={color} opacity="0.6"/>
    </>
  ),
  // Pattern 2: Document/checklist
  (color: string) => (
    <>
      <rect x="75" y="70" width="50" height="60" fill="none" stroke={color} strokeWidth="2" rx="4"/>
      <line x1="85" y1="85" x2="115" y2="85" stroke={color} strokeWidth="2"/>
      <line x1="85" y1="100" x2="115" y2="100" stroke={color} strokeWidth="2"/>
      <line x1="85" y1="115" x2="105" y2="115" stroke={color} strokeWidth="2"/>
      <rect x="80" y="80" width="5" height="5" fill={color} opacity="0.5"/>
      <rect x="80" y="95" width="5" height="5" fill={color} opacity="0.5"/>
      <rect x="80" y="110" width="5" height="5" fill={color} opacity="0.5"/>
    </>
  ),
  // Pattern 3: Target/goal
  (color: string) => (
    <>
      <circle cx="100" cy="100" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke={color} strokeWidth="1" opacity="0.7"/>
      <circle cx="100" cy="100" r="10" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="4" fill={color}/>
    </>
  ),
  // Pattern 4: Award/achievement
  (color: string) => (
    <>
      <polygon points="100,70 106,88 125,88 110,100 116,118 100,108 84,118 90,100 75,88 94,88"
        fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="95" r="8" fill={color} opacity="0.4"/>
    </>
  ),
  // Pattern 5: Book/learning
  (color: string) => (
    <>
      <path d="M70 80 L100 90 L130 80 L130 120 L100 130 L70 120 Z" fill="none" stroke={color} strokeWidth="2"/>
      <line x1="100" y1="90" x2="100" y2="130" stroke={color} strokeWidth="2"/>
      <line x1="80" y1="100" x2="95" y2="105" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="80" y1="110" x2="95" y2="115" stroke={color} strokeWidth="1" opacity="0.6"/>
    </>
  ),
  // Pattern 6: Calendar/timeline
  (color: string) => (
    <>
      <rect x="70" y="75" width="60" height="50" fill="none" stroke={color} strokeWidth="2" rx="4"/>
      <line x1="70" y1="90" x2="130" y2="90" stroke={color} strokeWidth="2"/>
      <rect x="80" y="100" width="10" height="10" fill={color} opacity="0.3"/>
      <rect x="95" y="100" width="10" height="10" fill={color} opacity="0.5"/>
      <rect x="110" y="100" width="10" height="10" fill={color} opacity="0.3"/>
      <circle cx="80" cy="82" r="3" fill={color}/>
      <circle cx="120" cy="82" r="3" fill={color}/>
    </>
  ),
  // Pattern 7: Network/connections
  (color: string) => (
    <>
      <circle cx="100" cy="100" r="6" fill={color}/>
      <circle cx="75" cy="80" r="4" fill={color} opacity="0.7"/>
      <circle cx="125" cy="80" r="4" fill={color} opacity="0.7"/>
      <circle cx="75" cy="120" r="4" fill={color} opacity="0.7"/>
      <circle cx="125" cy="120" r="4" fill={color} opacity="0.7"/>
      <line x1="100" y1="100" x2="75" y2="80" stroke={color} strokeWidth="1"/>
      <line x1="100" y1="100" x2="125" y2="80" stroke={color} strokeWidth="1"/>
      <line x1="100" y1="100" x2="75" y2="120" stroke={color} strokeWidth="1"/>
      <line x1="100" y1="100" x2="125" y2="120" stroke={color} strokeWidth="1"/>
    </>
  ),
  // Pattern 8: Arrow/progress
  (color: string) => (
    <>
      <path d="M70 100 L120 100 L110 90 M120 100 L110 110" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="80" cy="100" r="3" fill={color} opacity="0.3"/>
      <circle cx="95" cy="100" r="3" fill={color} opacity="0.5"/>
      <circle cx="110" cy="100" r="3" fill={color} opacity="0.7"/>
    </>
  ),
  // Pattern 9: Lightbulb/idea
  (color: string) => (
    <>
      <circle cx="100" cy="90" r="20" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M90 110 L90 120 L110 120 L110 110" fill="none" stroke={color} strokeWidth="2"/>
      <line x1="95" y1="125" x2="105" y2="125" stroke={color} strokeWidth="2"/>
      <line x1="100" y1="70" x2="100" y2="60" stroke={color} strokeWidth="1"/>
      <line x1="120" y1="90" x2="130" y2="90" stroke={color} strokeWidth="1"/>
      <line x1="80" y1="90" x2="70" y2="90" stroke={color} strokeWidth="1"/>
    </>
  ),
  // Pattern 10: Shield/protection
  (color: string) => (
    <>
      <path d="M100 70 L125 85 L125 110 Q125 125 100 135 Q75 125 75 110 L75 85 Z"
        fill="none" stroke={color} strokeWidth="2"/>
      <path d="M90 100 L98 108 L115 90" fill="none" stroke={color} strokeWidth="2"/>
    </>
  ),
]

interface ArticleSVGProps {
  index: number
}

export default function ArticleSVG({ index }: ArticleSVGProps) {
  const colorIndex = index % colorPalettes.length
  const backgroundColor = colorPalettes[colorIndex]
  const strokeColor = strokeColors[colorIndex]
  const patternIndex = index % svgPatterns.length
  const Pattern = svgPatterns[patternIndex]

  return (
    <div
      className="article-svg-wrapper"
      style={{
        backgroundColor,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
        {Pattern(strokeColor)}
      </svg>
    </div>
  )
}
