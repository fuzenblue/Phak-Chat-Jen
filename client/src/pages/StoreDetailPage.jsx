import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import api from '../services/api';

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const response = await api.get(`v1/shops/${id}`);
        setShop(response.data.data);
      } catch (err) {
        console.error("Fetch shop failed:", err);
        setError("ไม่สามารถโหลดข้อมูลร้านค้าได้");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchShop();
  }, [id]);

  const getFreshnessStatus = (score) => {
    if (score >= 75) return { label: 'สด', color: 'bg-green-100 text-green-600' };
    if (score >= 50) return { label: 'ใกล้หมด', color: 'bg-yellow-100 text-yellow-600' };
    return { label: 'ควรเร่งขาย', color: 'bg-red-100 text-red-500' };
  };

  const getFreshnessBarColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleNavigate = () => {
    if (shop) {
      window.open(`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`, '_blank');
    }
  };

  const formatHours = (hours) => {
    if (!hours) return "ไม่ระบุเวลา";
    if (typeof hours === 'string') return hours;
    
    // Simple logic to show today's hours or summary
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const today = days[new Date().getDay()];
    const h = hours[today];
    if (h && h.enabled) {
      return `${h.open} - ${h.close}`;
    }
    return "ปิดทำการวันนี้";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-prompt">
        <span className="material-symbols-outlined animate-spin text-green-500 text-[40px]">progress_activity</span>
        <p className="mt-4 text-gray-400">กำลังโหลดข้อมูลร้านค้า...</p>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-prompt px-6 text-center">
        <span className="material-symbols-outlined text-red-400 text-[60px] mb-4">storefront</span>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{error || "ไม่พบร้านค้า"}</h2>
        <button onClick={() => navigate('/map')} className="text-green-600 font-bold border-b-2 border-green-600 pb-1 mt-4">กลับหน้าแผนที่</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt pb-10 pt-14">
      <CustomerNavbar title="ร้านและสินค้า" back />
      <main className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div className="flex gap-4">
            <img 
              src={shop.image_url || 'https://images.unsplash.com/photo-1488459711621-27bef697b055?q=80&w=200&auto=format&fit=crop'} 
              alt={shop.shop_name} 
              className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-gray-100 shrink-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488459711621-27bef697b055?q=80&w=200&auto=format&fit=crop' }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-bold text-lg text-gray-800 leading-tight truncate">
                  {shop.shop_name}
                </h2>
                <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${shop.is_open_now ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {shop.is_open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {shop.description || "ไม่มีรายละเอียดร้านค้า"}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-gray-400">schedule</span>
              <span>{formatHours(shop.opening_hours)}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0 mt-0.5">location_on</span>
              <span className="line-clamp-2">{shop.shop_address || "ไม่ระบุที่อยู่"}</span>
            </div>
          </div>

          <button onClick={handleNavigate} className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">directions</span>
            นำทางไปร้าน
          </button>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 px-1">
              สินค้าในร้าน 
              <span className="text-gray-400 font-normal text-sm">({shop.posts?.length || 0})</span>
            </h3>
          </div>

          {!shop.posts || shop.posts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
              <span className="text-4xl mb-3 block">🥦</span>
              <p className="text-gray-400 text-sm">ขออภัย ยังไม่มีสินค้าวางขายในขณะนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {shop.posts.map(product => {
                const status = getFreshnessStatus(product.scan.freshness_score);
                const discount = product.original_price ? Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100) : 0;

                return (
                  <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-500 hover:scale-[1.02]">
                    <div className="relative w-full aspect-square bg-gray-100">
                      <img src={product.scan.image_url} alt={product.scan.veg_type} className="absolute inset-0 w-full h-full object-cover"/>
                      {discount > 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg shadow-sm">
                            -{discount}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 flex flex-col flex-1 space-y-2">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-gray-800 truncate text-sm">
                          {product.scan.veg_type}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400 font-medium">
                            {product.scan.veg_type}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mr-2">
                            <div className={`h-full ${getFreshnessBarColor(product.scan.freshness_score)} transition-all`} style={{ width: `${product.scan.freshness_score}%` }}/>
                          </div>
                          <span className="shrink-0 font-bold text-gray-500 font-funnel">{product.scan.freshness_score}/100</span>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-snug">
                          {product.scan.ai_summary}
                        </p>
                      </div>

                      <div className="pt-1 mt-auto flex items-baseline gap-1.5">
                        <span className="text-green-600 font-bold font-funnel text-base">฿{product.price}</span>
                        {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                          <span className="text-gray-300 line-through text-[10px] font-funnel">฿{product.original_price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
