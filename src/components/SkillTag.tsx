type SkillTagProps = {
  label: string;
  onRemove?: () => void;
};

export default function SkillTag({ label, onRemove }: SkillTagProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 leading-none ml-0.5"
          aria-label={`Remove ${label}`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
