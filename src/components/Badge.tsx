type BadgeProps = {
  status: "ACTIVE" | "CLOSED" | string;
};

export default function Badge({ status }: BadgeProps) {
  const styles =
    status === "ACTIVE"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-gray-100 text-gray-500 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      {status === "ACTIVE" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
      )}
      {status}
    </span>
  );
}
