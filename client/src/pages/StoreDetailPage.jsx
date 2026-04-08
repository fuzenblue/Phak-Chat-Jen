import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Check if this shop is already favorited (only when user is logged in)
  useEffect(() => {
    if (!user || !id) return;
    const checkFavorite = async () => {
      try {
        const res = await api.get(`/v1/favorites/check/${id}`);
        setIsFavorited(res.data.data.is_favorited);
      } catch (err) {
        console.error('Check favorite failed:', err);
      }
    };
    checkFavorite();
  }, [user, id]);

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

  const handleFavorite = async () => {
    if (!user) {
      setToast('กรุณาเข้าสู่ระบบก่อน');
      setTimeout(() => {
        setToast('');
        navigate('/login');
      }, 1500);
      return;
    }

    // Optimistic update
    const prev = isFavorited;
    setIsFavorited(!prev);

    try {
      if (!prev) {
        // Adding to favorites
        await api.post('/v1/favorites', { shop_id: id });
      } else {
        // Removing from favorites
        await api.delete(`/v1/favorites/${id}`);
      }
    } catch (err) {
      console.error('Toggle favorite failed:', err);
      // Rollback on failure
      setIsFavorited(prev);
      setToast('เกิดข้อผิดพลาด กรุณาลองใหม่');
      setTimeout(() => setToast(''), 2000);
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
              src={shop.image_url || 'https://placehold.co/200x200/e8f5e9/4caf50?text=🌿'} 
              alt={shop.shop_name} 
              className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-gray-100 shrink-0"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/e8f5e9/4caf50?text=🌿' }}
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

          {/* Navigate + Favorite row */}
          <div className="flex gap-2 items-stretch">
            <button
              onClick={handleNavigate}
              className="flex-1 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">directions</span>
              นำทางไปร้าน
            </button>
            <button
              onClick={handleFavorite}
              className="w-24 bg-white border border-gray-200 rounded-2xl h-12 flex items-center justify-center transition-all hover:bg-red-50 active:scale-[0.96]"
              aria-label={isFavorited ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-colors ${
                  isFavorited
                    ? 'text-red-500 [font-variation-settings:"FILL"_1]'
                    : 'text-gray-400'
                }`}
              >
                favorite
              </span>
            </button>
          </div>

          {/* Toast notification */}
          {toast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg animate-fade-in">
              {toast}
            </div>
          )}
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
              <span className="material-symbols-outlined text-[48px] text-green-200 mb-3 block [font-variation-settings:'FILL'_1]">eco</span>
              <p className="text-gray-400 text-sm">ขออภัย ยังไม่มีสินค้าวางขายในขณะนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {shop.posts.map(product => {
                const status = getFreshnessStatus(product.scan.freshness_score);
                const discount = product.original_price ? Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100) : 0;

                return (
                  <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-500 hover:scale-[1.02]">
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 transition-all duration-300 animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white w-full sm:w-[750px] h-[85vh] sm:h-[450px] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col sm:flex-row overflow-hidden shadow-2xl animate-slide-up sm:animate-zoom-in relative"
          >
            {/* Desktop Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="hidden sm:flex absolute top-4 right-4 z-50 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full items-center justify-center transition-colors"
              aria-label="ปิด"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">close</span>
            </button>

            {/* Header + Image */}
            <div className="relative w-full sm:w-[45%] aspect-square sm:aspect-auto bg-gray-100 shrink-0">
              <img src={selectedProduct.scan.image_url} alt={selectedProduct.scan.veg_type} className="absolute inset-0 w-full h-full object-cover"/>
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="sm:hidden absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="ปิด"
              >
                <span className="material-symbols-outlined text-[20px] font-bold">close</span>
              </button>
            </div>

            {/* Details Content */}
            <div className="flex flex-col flex-1 min-w-0 bg-white">
              <div className="p-6 sm:pr-14 overflow-y-auto flex-1 font-prompt space-y-5">
              {/* Title & Status */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.scan.veg_type}</h3>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${getFreshnessStatus(selectedProduct.scan.freshness_score).color}`}>
                    ความสด {selectedProduct.scan.freshness_score}%
                  </span>
                  {selectedProduct.scan.freshness_label && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-semibold border border-gray-200">
                      {selectedProduct.scan.freshness_label}
                    </span>
                  )}
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-end gap-3 p-4 bg-green-50 rounded-2xl border border-green-100/50 relative overflow-hidden">
                <div className="flex flex-col relative z-10">
                  <span className="text-[11px] text-green-700 font-bold tracking-wide">ราคาขาย</span>
                  <span className="text-3xl font-bold text-green-600 font-funnel leading-none mt-0.5">฿{selectedProduct.price}</span>
                </div>
                {selectedProduct.original_price && parseFloat(selectedProduct.original_price) > parseFloat(selectedProduct.price) && (
                  <div className="flex flex-col items-start mb-0.5 relative z-10">
                    <span className="text-[11px] text-gray-400">ราคาเดิม</span>
                    <span className="text-[15px] font-bold text-gray-400 line-through font-funnel leading-none">฿{selectedProduct.original_price}</span>
                  </div>
                )}
                {/* Save label */}
                {selectedProduct.original_price && parseFloat(selectedProduct.original_price) > parseFloat(selectedProduct.price) && (
                  <div className="ml-auto bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm relative z-10">
                    ลด {Math.round(((parseFloat(selectedProduct.original_price) - parseFloat(selectedProduct.price)) / parseFloat(selectedProduct.original_price)) * 100)}%
                  </div>
                )}
              </div>

              {/* AI Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-green-500 text-[20px]">psychiatry</span>
                  AI วิเคราะห์สภาพสินค้า
                </h4>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-[13px] text-gray-600 leading-relaxed shadow-inner">
                  {selectedProduct.scan.ai_summary || "ไม่มีข้อมูลการวิเคราะห์สภาพสินค้าเพิ่มเติม"}
                </div>
              </div>
              
              {/* Expiry Warning */}
              {selectedProduct.expired_at && (
                <div className="flex items-start gap-2 bg-yellow-50 text-yellow-700 p-3 rounded-xl border border-yellow-100/50 text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">timer</span>
                  <p>ควรขายให้หมดภายใน {new Date(selectedProduct.expired_at).toLocaleDateString('th-TH')} เวลา {new Date(selectedProduct.expired_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              )}
            </div>
              {/* Action Bar (Mobile Only) */}
              <div className="p-4 bg-white border-t border-gray-50 shrink-0 sm:hidden">
                 <button onClick={() => setSelectedProduct(null)} className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 transition-all text-sm">
                   ปิดหน้าต่าง
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
