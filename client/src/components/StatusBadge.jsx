//StatusBadge — Badge สถานะสินค้าจาก AI freshness score

const BADGE_CONFIG = {
  fresh:   { label: "🟢 สดใหม่",     classes: "bg-green-500 text-white" },
  near:    { label: "🟠 ใกล้หมด",    classes: "bg-amber-400 text-white" },
  urgent:  { label: "🔴 ควรเร่งขาย", classes: "bg-red-500 text-white" },
  soldout: { label: "หมดแล้ว",        classes: "bg-gray-300 text-gray-600" },
};

//scoreToBadgeType — แปลง freshness score → badge type ใช้แทน AI จนกว่าจะเชื่อม Qwen VL Max

export function scoreToBadgeType(score) {
  if (score >= 80) return "fresh";
  if (score >= 55) return "near";
  return "urgent";
}

export default function StatusBadge({ type }) {
  const cfg = BADGE_CONFIG[type] ?? BADGE_CONFIG.fresh;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
