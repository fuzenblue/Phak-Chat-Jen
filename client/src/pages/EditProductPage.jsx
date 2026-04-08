import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MerchantNavbar from "../components/MerchantNavbar";
import FreshnessBar from "../components/FreshnessBar";
import StatusBadge, { scoreToBadgeType } from "../components/StatusBadge";
import api from "../services/api";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState(""); 
  const [isActive, setIsActive] = useState(true);

  // 1. ดึงข้อมูลจาก DB จริงมาโชว์ตอนโหลดหน้า
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // เรียกไปที่ /v1/posts/:id ตามโครงสร้างตาราง posts
        const response = await api.get(`v1/posts/${id}`);
        const data = response.data.data;
        
        setProduct(data);
        setSalePrice(String(data.price));
        setQuantity(String(data.quantity));
        setIsActive(data.status === 'active');
      } catch (err) {
        console.error("Error fetching product:", err);
        alert("ไม่สามารถโหลดข้อมูลจาก Database ได้");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ระบบเช็คราคากับ AI (ล็อคไม่ให้เกิน recommended_price ถ้ามีใน DB)
  const isPriceTooHigh = Number(salePrice) > (product?.recommended_price || product?.price);

  // 2. บันทึกข้อมูลลง DB จริง
  const handleSave = async () => {
    if (isPriceTooHigh) {
      alert("ราคาขายห้ามสูงกว่าที่ AI แนะนำ");
      return;
    }

    try {
      setSaving(true);
      // เตรียม Payload ให้ตรงกับชื่อคอลัมน์ในตาราง posts
      const payload = { 
        price: Number(salePrice), 
        quantity: Number(quantity), 
        status: isActive ? 'active' : 'inactive' 
      };

      // ยิง PATCH ไปที่ API ของเพื่อน
      await api.patch(`v1/posts/${id}`, payload);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("บันทึกไม่สำเร็จ กรุณาเช็คการเชื่อมต่อ API");
    } finally {
      setSaving(false);
    }
  };

  // 3. ฟังก์ชันลบสินค้าออกจาก DB
  const handleDelete = async () => {
    if (!window.confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`v1/posts/${id}`);
      navigate("/merchant/dashboard");
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-green-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Sarabun'] pb-12">

      {/* DaisyUI v5 Success Modal */}
      <dialog className={`modal ${showSuccess ? 'modal-open' : ''}`}>
        <div className="modal-box text-center rounded-3xl">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
            </div>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">บันทึกสำเร็จ!</h3>
          <p className="text-gray-400 text-sm mb-6">อัปเดตข้อมูลสินค้าในระบบเรียบร้อยแล้ว</p>
          <button
            onClick={() => { setShowSuccess(false); navigate(-1); }}
            className="btn btn-success text-white w-full rounded-xl font-bold"
          >
            กลับหน้าสินค้า
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowSuccess(false)}>close</button>
        </form>
      </dialog>

      <MerchantNavbar shopName={product?.shop_name || "ร้านของคุณ"} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-gray-200">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl font-black">แก้ไขสินค้า</h1>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving || isPriceTooHigh}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition ${
              isPriceTooHigh ? "bg-gray-300" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ส่วนแสดงผลรูปภาพและ AI */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm p-6">
              <img src={product?.image} className="w-full aspect-square object-cover rounded-2xl mb-6" alt="" />
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{product?.name}</h2>
                <StatusBadge type={isActive ? scoreToBadgeType(product?.freshness_score) : 'soldout'} />
              </div>
              <FreshnessBar score={product?.freshness_score} />
            </div>
          </div>

          {/* ส่วนแก้ไขข้อมูลที่เชื่อมกับ DB */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">จัดการคลังสินค้าและราคา</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ราคาขาย (฿)</label>
                  <input 
                    type="number" 
                    value={salePrice} 
                    onChange={(e) => setSalePrice(e.target.value)}
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 font-bold outline-none ${
                      isPriceTooHigh ? "border-red-400 text-red-600" : "border-gray-100 focus:border-green-400"
                    }`}
                  />
                  {isPriceTooHigh && <p className="text-xs text-red-500 mt-2 font-bold">ราคาสูงกว่าที่ AI แนะนำ!</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">จำนวนในสต็อก (Quantity)</label>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold focus:border-green-400 outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="font-bold">สถานะการแสดงผล</p>
                  <p className="text-xs text-gray-400">เปิดเพื่อให้ลูกค้าเห็นในหน้าร้าน</p>
                </div>
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <button onClick={handleDelete} className="w-full py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition border border-red-100">
              ลบสินค้าออกจากระบบ
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}