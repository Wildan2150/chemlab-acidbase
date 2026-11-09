import { useId } from 'react';
import {
  ArrowUpRight,
  Atom,
  Beaker,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  ClipboardCheck,
  Download,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Menu,
  RotateCcw,
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  CircleCheck,
  SlidersHorizontal,
} from 'lucide-react';

const icons = {
  home: LayoutDashboard,
  book: BookOpen,
  flask: FlaskConical,
  quiz: ClipboardCheck,
  chart: ChartNoAxesCombined,
  teacher: GraduationCap,
  help: HelpCircle,
  menu: Menu,
  close: X,
  search: Search,
  arrow: ArrowRight,
  back: ArrowLeft,
  next: ChevronRight,
  check: Check,
  done: CircleCheck,
  leaf: Leaf,
  atom: Atom,
  bulb: Lightbulb,
  reset: RotateCcw,
  download: Download,
  external: ExternalLink,
  up: ArrowUpRight,
  sliders: SlidersHorizontal,
  beaker: Beaker,
};
export function Icon({ name, size = 20, ...props }) {
  const Component = icons[name] || Atom;
  return <Component size={size} strokeWidth={1.8} aria-hidden="true" {...props} />;
}

export function BeakerDrawing({
  color = '#7eaa83',
  className = '',
  label = 'Ilustrasi gelas berisi larutan',
  bubbles = true,
}) {
  const id = useId().replaceAll(':', '');
  return (
    <svg
      className={`beaker-drawing ${className}`}
      viewBox="0 0 160 190"
      role="img"
      aria-label={label}
    >
      <defs>
        <clipPath id={id}>
          <path d="M34 23H132V163Q132 174 120 174H46Q34 174 34 162Z" />
        </clipPath>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".65" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#fff" stopOpacity=".4" />
        </linearGradient>
      </defs>
      <ellipse cx="83" cy="178" rx="58" ry="6" fill="#163c2b" opacity=".07" />
      <path
        d="M25 23H132V163Q132 174 120 174H46Q34 174 34 162V34Z"
        fill={`url(#${id}-glass)`}
        stroke="#476c59"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g clipPath={`url(#${id})`}>
        <path d="M25 91Q55 82 83 91T140 89V180H25Z" fill={color} opacity=".65" />
        <ellipse cx="83" cy="91" rx="50" ry="7" fill={color} opacity=".55" />
        {bubbles && (
          <g fill="#fff" opacity=".62">
            <circle cx="56" cy="137" r="4" />
            <circle cx="98" cy="114" r="3" />
            <circle cx="110" cy="149" r="5" />
            <circle cx="75" cy="155" r="2" />
          </g>
        )}
      </g>
      <path
        d="M44 40V157Q44 164 51 164"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        opacity=".7"
        strokeLinecap="round"
      />
      <g stroke="#476c59" strokeWidth="1.5" opacity=".65">
        <path d="M114 55h17M121 72h10M114 90h17M121 108h10M114 126h17M121 144h10" />
      </g>
      <text x="77" y="69" fill="#476c59" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
        100 mL
      </text>
    </svg>
  );
}

export function HeroIllustration() {
  return (
    <div
      className="hero-art"
      aria-label="Tiga ilustrasi larutan: asam pH 2, netral pH 7, basa pH 12"
      role="img"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <span className="art-spark spark-one">✳</span>
      <span className="art-plus">+</span>
      <div className="formula-chip">
        H₃O⁺ <span>↔</span> OH⁻
      </div>
      <div className="hero-beakers" aria-hidden="true">
        <div className="hero-beaker acid">
          <div className="ph-pill">
            pH <b>2</b>
          </div>
          <BeakerDrawing color="#e5a06e" />
          <span>Asam</span>
        </div>
        <div className="hero-beaker neutral">
          <div className="ph-pill">
            pH <b>7</b>
          </div>
          <BeakerDrawing color="#8faf70" />
          <span>Netral</span>
        </div>
        <div className="hero-beaker base">
          <div className="ph-pill">
            pH <b>12</b>
          </div>
          <BeakerDrawing color="#a49bc9" />
          <span>Basa</span>
        </div>
      </div>
      <div className="art-caption">
        <span className="tiny-dot" /> Beda pH, beda cerita.
      </div>
    </div>
  );
}

export function PhScale({ ph = 7, labels = true }) {
  return (
    <div className="ph-scale" aria-label={`Posisi pada skala pH: ${ph}`}>
      <div className="spectrum">
        <span className="scale-marker" style={{ left: `${(ph / 14) * 100}%` }} />
      </div>
      {labels && (
        <div className="scale-labels">
          <span>0 · Asam</span>
          <span>7 · Netral</span>
          <span>14 · Basa</span>
        </div>
      )}
    </div>
  );
}
