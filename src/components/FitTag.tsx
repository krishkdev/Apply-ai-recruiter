type FitLevel = "strong" | "possible" | "weak";

const config: Record<FitLevel, { label: string; classes: string }> = {
  strong:   { label: "Strong fit",   classes: "bg-green-50 text-green-700 border-green-200" },
  possible: { label: "Possible fit", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  weak:     { label: "Weak fit",     classes: "bg-red-50 text-red-600 border-red-200" },
};

export function getFitLevel(score: number): FitLevel {
  if (score >= 70) return "strong";
  if (score >= 40) return "possible";
  return "weak";
}

type FitTagProps = {
  score: number;
  size?: "sm" | "lg";
};

export default function FitTag({ score, size = "sm" }: FitTagProps) {
  const level = getFitLevel(score);
  const { label, classes } = config[level];
  const sizeClasses =
    size === "lg"
      ? "px-3 py-1 text-sm font-semibold rounded-full"
      : "px-2 py-0.5 text-xs font-medium rounded-full";

  return (
    <span className={`inline-flex items-center border ${classes} ${sizeClasses}`}>
      {label}
    </span>
  );
}
