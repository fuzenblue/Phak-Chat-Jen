import { useNavigate } from "react-router-dom";
import FreshnessBar from "./FreshnessBar";
import StatusBadge, { scoreToBadgeType } from "./StatusBadge";

export default function ProductCard({ product, onDelete, onEdit }) {
  const navigate = useNavigate();
  const badgeType = product.isActive ? scoreToBadgeType(product.freshnessScore) : "soldout";
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* รูปสินค้า */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl || `https://placehold.co/400x300/e8f5e9/1b5e20?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/e8f5e9/1b5e20?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* ✅ เพิ่ม Badge จำนวนสินค้าบนรูป (เผื่ออยากให้เด่น) หรือจะโชว์ข้างล่างก็ได้ */}
        {product.quantity <= 3 && product.isActive && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
            ใกล้หมด!
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* ชื่อ + badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-xs text-gray-400">{product.category}</p>
            </div>
          </div>
          <div className="flex-shrink-0 mt-0.5">
            <StatusBadge type={badgeType} />
          </div>
        </div>

        {/* Freshness bar */}
        <div className="mt-3">
          <FreshnessBar score={product.freshnessScore} />
        </div>

        {/* ราคา */}
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold text-green-600">
            ฿{hasDiscount ? product.salePrice : product.price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-400 line-through">฿{product.price}</span>
              <span className="text-xs font-semibold text-red-500">ลด {discountPct}%</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => onEdit(product.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            แก้ไข
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-red-50/50 text-red-400 hover:bg-red-50 transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}