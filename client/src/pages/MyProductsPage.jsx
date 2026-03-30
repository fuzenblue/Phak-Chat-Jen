import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MerchantNavbar from "../components/MerchantNavbar";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
const TABS = [
  { key: "all",     label: "ทั้งหมด" },
  { key: "selling", label: "กำลังขาย" },
  { key: "soldout", label: "หมดแล้ว" },
];

export default function MyProductsPage() {
  const navigate = useNavigate();
  const { user, token, logout, loading: authLoading } = useAuth();
  
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteId, setDeleteId]   = useState(null);

  // 🛡️ ส่วนป้องกัน: ถ้าไม่มี Token ให้ดีดออกหน้า Login ทันที (แก้ปัญหาย้อนกลับได้)
  useEffect(() => {
    if (!authLoading && !token) {
      window.location.replace("/login"); 
    }
  }, [token, authLoading]);

  // 🥬 ส่วนดึงข้อมูลสินค้า
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('v1/posts/my-shop');
        
        // Map backend data to frontend format
        const mappedData = response.data.data.map(p => ({
          id: p.id,
          name: p.scan.veg_type,
          category: p.scan.veg_type,
          price: p.original_price,
          salePrice: parseFloat(p.price) < parseFloat(p.original_price) ? p.price : null,
          freshnessScore: p.scan.freshness_score,
          imageUrl: p.scan.image_url,
          isActive: p.status === 'active',
          aiSummary: p.scan.ai_summary
        }));

        setProducts(mappedData);
      } catch (err) {
        if (err.response?.data?.error?.code === 'SHOP_NOT_FOUND') {
          navigate('/dashboard/setup');
          return;
        }
        const msg = err.response?.data?.error?.message || "ไม่สามารถโหลดข้อมูลสินค้าได้";
        setError(msg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token]);

  // ป้องกันหน้าจอขาวแวบ หรือ error ตอน user ยังโหลดไม่เสร็จ
  if (authLoading || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Filter สินค้าตาม Tab
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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/v1/posts/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("ไม่สามารถลบสินค้าได้");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Sarabun', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ✅ เชื่อม Navbar เข้ากับ AuthContext เรียบร้อย */}
      <MerchantNavbar 
        shopName={"ร้านค้าของฉัน"} 
        ownerName={user?.email || "เจ้าของร้าน"} 
        onLogout={logout} 
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900">สินค้าของฉัน</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
              <span className="material-symbols-outlined text-gray-400">settings</span>
            </button>
            <button
              onClick={() => navigate("/add-product")} // ✅ แก้ Path ให้ตรงกับ App.jsx
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full animate-spin" />
            <p className="text-sm">กำลังโหลดสินค้า...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-red-400">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <span className="text-5xl">🥬</span>
            <p className="text-sm font-medium">ไม่มีสินค้าในหมวดนี้</p>
          </div>
        )}

        {/* Product Grid */}
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

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl text-center">
             <h3 className="text-base font-bold text-gray-900 mb-2">ลบสินค้านี้?</h3>
             <p className="text-sm text-gray-500 mb-6">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold">ยกเลิก</button>
               <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold">ลบสินค้า</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}