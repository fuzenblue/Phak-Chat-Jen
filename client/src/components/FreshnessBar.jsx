//FreshnessBar — แสดงแถบความสดของสินค้า
export default function FreshnessBar({ score }) {
  const getColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 55) return "bg-amber-400";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-xs text-gray-500 whitespace-nowrap">ความสด:</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{score}/100</span>
    </div>
  );
}
