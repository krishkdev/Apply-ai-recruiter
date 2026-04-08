type Props = { score: number; size?: number };

function arcColor(score: number): string {
  if (score >= 70) return "#6366f1";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function trackColor(score: number): string {
  if (score >= 70) return "#eef2ff";
  if (score >= 40) return "#fffbeb";
  return "#fef2f2";
}

export default function AIConfidenceMeter({ score, size = 52 }: Props) {
  const r = 20;
  const cx = 26;
  const cy = 26;
  const circumference = 2 * Math.PI * r; // 125.66
  const offset = circumference * (1 - score / 100);
  const color = arcColor(score);
  const track = trackColor(score);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={4}
        />
        {/* Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {/* Score label — counter-rotate so text is upright */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            fill: color,
            transform: "rotate(90deg)",
            transformOrigin: "26px 26px",
          }}
        >
          {score}
        </text>
      </svg>
      <span className="text-[10px] text-gray-400 leading-none">AI match</span>
    </div>
  );
}
