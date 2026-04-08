import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
  const [products, setProducts]   = useState([]);
  const [shopData, setShopData]   = useState(null); // เก็บข้อมูลร้านค้า
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteId, setDeleteId]   = useState(null);

  //1. ป้องกันการเข้าถึงโดยไม่ Login (แก้ปัญหากด Back แล้วยังเข้าได้)
  useEffect(() => {
    if (!authLoading && !token) {
      window.location.replace("/login"); 
    }
  }, [token, authLoading]);

  // 2. ส่วนดึงข้อมูลร้านค้าและสินค้า
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูลร้านค้า 
        const shopRes = await api.get('v1/shops/my-shop');
        const shopInfo = shopRes.data.data || shopRes.data;
        setShopData(shopInfo);
        // ดึงข้อมูลสินค้าทั้งหมดของร้าน
        const response = await api.get('v1/posts/my-shop');
        
        const mappedData = response.data.data.map(p => ({
          id: p.id,
          name: p.scan.veg_type,
          category: p.scan.veg_type,
          price: p.original_price,
          salePrice: parseFloat(p.price) < parseFloat(p.original_price) ? p.price : null,
          freshnessScore: p.scan.freshness_score,
          imageUrl: p.scan.image_url,
          isActive: p.status === 'active',
          aiSummary: p.scan.ai_summary,
          quantity: p.quantity // ดึงจำนวนสินค้ามาแสดง
        }));

        setProducts(mappedData);
        const now = new Date().toLocaleTimeString('th-TH'); // ดึงเวลาปัจจุบันรูปแบบไทย (เช่น 15:46:04)
        const userEmail = user?.email || "Unknown User";
      
        console.log(`✅ [${now}] Products Loaded for: ${userEmail}`);
      } catch (err) {
        if (err.response?.status === 404 || err.response?.data?.error?.code === 'SHOP_NOT_FOUND') {
          console.warn("`⚠️ [${now}] User: ${user?.email} has no shop. Redirecting to setup...`");
          navigate('/dashboard/setup');
          return;
        }
        setError("ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้ง");
        console.error(err);
        
      } finally {
        setLoading(false);
      }
    };

    if (token) { fetchData(); }
  }, [token, navigate, location]);


  const handleDelete = async (id) => {
    try {
      await api.delete(`v1/posts/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("ไม่สามารถลบสินค้าได้");
    }
  };

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


  if (authLoading || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Sarabun', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      
      <MerchantNavbar 
        shopName={shopData?.shop_name || "กำลังโหลดชื่อร้าน..."} 
        ownerName={user?.name || user?.email || "เจ้าของร้าน"} 
        onLogout={logout} 
      />

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ─── Header Row ─── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-900">สินค้าของฉัน</h1>
            {!loading && !error && (
              <p className="text-sm text-gray-400 mt-0.5">{counts.all} รายการทั้งหมด</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard/setup")}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
              title="ตั้งค่าร้านค้า"
            >
              <span className="material-symbols-outlined text-gray-400">settings</span>
            </button>
            <button
              onClick={() => navigate("/add-product")}
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-green-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              เพิ่มสินค้า
            </button>
          </div>
        </div>

        {/* ─── Tab Switcher ─── */}
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

        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full animate-spin" />
            <p className="text-sm">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <span className="text-5xl">🥬</span>
            <p className="text-sm font-medium">ไม่มีสินค้าในหมวดนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={(id) => setDeleteId(id)}
                onEdit={(id) => navigate(`/merchant/products/${id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>

      
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