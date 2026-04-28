type Props = {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
};

export default function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  label,
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Прогресс ${clamped}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track — uses CSS class so dark mode works */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#e5e7eb] dark:stroke-[#374151]"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10b981"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-ink dark:text-gray-100">
        {label ?? `${clamped}%`}
      </span>
    </div>
  );
}
