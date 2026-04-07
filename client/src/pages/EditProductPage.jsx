import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MerchantNavbar from "../components/MerchantNavbar";
import FreshnessBar from "../components/FreshnessBar";
import StatusBadge, { scoreToBadgeType } from "../components/StatusBadge";
import api from "../services/api";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/v1/posts/${id}`);
        const productData = data.data || data;
        const mappedProduct = {
          id: productData.id,
          name: productData.scan.veg_type,
          category: productData.scan.veg_type,
          price: productData.original_price,
          salePrice: parseFloat(productData.price) < parseFloat(productData.original_price) ? productData.price : null,
          freshnessScore: productData.scan.freshness_score,
          imageUrl: productData.scan.image_url,
          isActive: productData.status === 'active',
          aiAdvice: productData.scan.ai_summary,
          quantity: productData.quantity
        };
        setProduct(mappedProduct);
        setSalePrice(String(mappedProduct.salePrice ?? mappedProduct.price));
        setQuantity(mappedProduct.quantity ?? 1);
        setIsActive(mappedProduct.isActive);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { price: Number(salePrice), status: isActive ? 'active' : 'soldout', quantity: Number(quantity) };
      await api.patch(`/v1/posts/${id}`, payload);
      navigate("/dashboard");
    } catch (err) {
      alert("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/v1/posts/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Sarabun']">
        <MerchantNavbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Sarabun']">
        <MerchantNavbar />
        <div className="flex flex-col items-center justify-center py-32 gap-2 text-red-400">
          <p className="text-sm font-medium">{error ?? "ไม่พบสินค้า"}</p>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 underline">ย้อนกลับ</button>
        </div>
      </div>
    );
  }

  const badgeType = isActive ? scoreToBadgeType(product.freshnessScore) : "soldout";
  const aiAdvice = product.aiAdvice ?? "สินค้าสดใหม่ แนะนำให้รีบขาย";
  const currentSalePrice = Number(salePrice);
  const hasDiscount = currentSalePrice < product.price && currentSalePrice > 0;

  return (
    <div className="min-h-screen bg-gray-50 font-['Sarabun']">
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <MerchantNavbar />

      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-base font-black text-gray-900">แก้ไขสินค้า</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-green-100"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "บันทึก"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex gap-4">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://placehold.co/200x200?text=No+Image"; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h2 className="font-black text-lg text-gray-900 leading-tight">{product.name}</h2>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
                <StatusBadge type={badgeType} />
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500 font-medium">ความสด</span>
                <span className="font-black text-gray-900">{product.freshnessScore}/100</span>
              </div>
              <FreshnessBar score={product.freshnessScore} />
            </div>
          </div>

          <div className="mt-4 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
            <p className="text-sm text-blue-700 leading-relaxed">
              <span className="font-bold">✦ AI: </span>{aiAdvice}
            </p>
          </div>
        </div>

        <SectionCard title="ตั้งค่าราคา">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-3">
            <span className="text-sm text-gray-500">ราคาเต็ม</span>
            <span className="text-sm font-bold text-gray-900">฿{product.price}</span>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">ราคาขาย</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">฿</span>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Math.min(Number(e.target.value) || 0, product.price).toString())}
                max={product.price}
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-green-400 outline-none bg-gray-50"
              />
            </div>
            {hasDiscount && (
              <p className="text-xs text-red-500 font-medium mt-1.5">
                ลด {Math.round((1 - currentSalePrice / product.price) * 100)}% จากราคาเต็ม
              </p>
            )}
            <p className="text-xs text-red-500 font-medium mt-1.5">
              สามารถใส่ราคาเท่าเดิมหรือต่ำกว่านั้น
            </p>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">จำนวนคงเหลือ</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-green-400 outline-none bg-gray-50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">ชิ้น</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="สถานะสินค้า">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">กำลังขาย</p>
              <p className="text-xs text-gray-400 mt-0.5">สินค้าจะแสดงให้ลูกค้าเห็นในหน้าร้าน</p>
            </div>
            <Toggle checked={isActive} onChange={setIsActive} />
          </div>
        </SectionCard>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 rounded-2xl transition text-sm shadow-sm"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>

        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-bold py-4 rounded-2xl transition text-sm"
        >
          ลบสินค้านี้
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">ลบ "{product.name}"?</h3>
              <p className="text-sm text-gray-500">ข้อมูลจะถูกลบถาวร ไม่สามารถกู้คืนได้</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">ยกเลิก</button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-sm font-bold text-white">ลบสินค้า</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}