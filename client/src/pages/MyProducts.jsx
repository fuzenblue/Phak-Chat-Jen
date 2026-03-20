import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MerchantNavbar from "../components/MerchantNavbar";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

// ─── Mock data สำหรับ dev (ลบออกเมื่อ backend พร้อม) ───────────────────────
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "ผักกาดขาว",
    category: "ผักกาด",
    price: 30,
    salePrice: null,
    freshnessScore: 92,
    imageUrl: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&q=80",
    isActive: true,
  },
  {
    id: "2",
    name: "มะเขือเทศราชินี",
    category: "มะเขือเทศ",
    price: 40,
    salePrice: 32,
    freshnessScore: 75,
    imageUrl: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
    isActive: true,
  },
  {
    id: "3",
    name: "Chickpea",
    category: "ถั่ว",
    price: 25,
    salePrice: 15,
    freshnessScore: 58,
    imageUrl: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&q=80",
    isActive: true,
  },
];

const TABS = [
  { key: "all",     label: "ทั้งหมด" },
  { key: "selling", label: "กำลังขาย" },
  { key: "soldout", label: "หมดแล้ว" },
];

// Freshness AI Placeholder
export function calculateFreshnessScore(product) {
  // TODO: replace with real AI call
  return product.freshnessScore ?? 80;
}

export function getFreshnessAdvice(score) {
  if (score >= 80) return "สินค้าสดมาก ควรขายได้ภายใน 3-4 วัน";
  if (score >= 55) return "ความสดอยู่ในระดับปานกลาง ควรเร่งขาย";
  return "ความสดต่ำ ควรลดราคาเพื่อเร่งระบาย";
}

//Component
export default function MyProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteId, setDeleteId]   = useState(null); // confirm modal

  // Fetch 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // TODO: เปลี่ยนเป็น endpoint จริง เช่น api.get("/merchant/products")
        // const { data } = await api.get("/merchant/products");
        // setProducts(data);
        await new Promise((r) => setTimeout(r, 600)); // simulate latency
        setProducts(MOCK_PRODUCTS);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter 
  const filtered = products.filter((p) => {
    if (activeTab === "selling") return p.isActive;
    if (activeTab === "soldout") return !p.isActive;
    return true;
  });

  const counts = {
    all:     products.length,
    selling: products.filter((p) => p.isActive).length,
    soldout: products.filter((p) => !p.isActive).length,
  };

  // Delete 
  const handleDelete = async (id) => {
    try {
      // await api.delete(`/merchant/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteId(null);
    }
  };

  // Render 
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Sarabun', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <MerchantNavbar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900">สินค้าของฉัน</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/merchant/products/add")}
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-green-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มสินค้า
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({counts[tab.key]})
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full animate-spin" />
            <p className="text-sm">กำลังโหลดสินค้า...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-red-400">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <span className="text-5xl">🥬</span>
            <p className="text-sm font-medium">ไม่มีสินค้าในหมวดนี้</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">ลบสินค้านี้?</h3>
              <p className="text-sm text-gray-500">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-sm font-bold text-white transition"
              >
                ลบสินค้า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
