import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomerNavbar from '../components/CustomerNavbar';
import api from '../services/api';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && user === null) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) return null;

  // Fetch favorites from server
  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await api.get('favorites');
        setFavorites(response.data.data);
      } catch (err) {
        console.error('Fetch favorites failed:', err);
        setError('ไม่สามารถโหลดรายการโปรดได้');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  // Remove favorite (optimistic update)
  const handleRemove = async (e, favoriteEntry) => {
    e.stopPropagation();
    // Optimistically remove from UI first
    setFavorites(prev => prev.filter(f => f.id !== favoriteEntry.id));
    try {
      await api.delete(`favorites/${favoriteEntry.shop.id}`);
    } catch (err) {
      console.error('Remove favorite failed:', err);
      // Restore on failure
      setFavorites(prev => [favoriteEntry, ...prev]);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-prompt pb-10 pt-14">
      <CustomerNavbar title="ร้านที่ถูกใจ" back={true} />

      <main className="max-w-2xl mx-auto w-full py-4">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <span className="material-symbols-outlined animate-spin text-green-500 text-[36px]">
              progress_activity
            </span>
            <p className="text-sm text-gray-400">กำลังโหลด...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 px-6 text-center">
            <span className="material-symbols-outlined text-red-300 text-[48px]">error</span>
            <p className="text-gray-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-green-600 font-semibold text-sm border-b border-green-600"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <span className="material-symbols-outlined text-gray-300 text-[64px] [font-variation-settings:'FILL'_1]">
              favorite
            </span>
            <p className="font-bold text-gray-500 mt-4 text-base">ยังไม่มีร้านที่ถูกใจ</p>
            <p className="text-sm text-gray-400 mt-1">กดหัวใจที่หน้าร้านค้าเพื่อบันทึกร้านโปรด</p>
            <button
              onClick={() => navigate('/map')}
              className="bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-semibold rounded-2xl px-6 py-3 mt-6 transition-all shadow-md shadow-green-100"
            >
              ค้นหาร้านค้าใกล้ฉัน
            </button>
          </div>
        )}

        {/* Favorites List */}
        {!loading && !error && favorites.length > 0 && (
          <>
            <p className="text-xs text-gray-400 px-5 mb-2">
              {favorites.length} ร้านที่บันทึกไว้
            </p>

            <div>
              {favorites.map(fav => (
                <div
                  key={fav.id}
                  onClick={() => navigate(`/shops/${fav.shop.id}`)}
                  className="bg-white rounded-2xl shadow-sm mx-4 my-2 p-4 flex gap-3 items-center cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all"
                >
                  {/* Shop Image */}
                  <img
                    src={fav.shop.shop_image_url || 'https://placehold.co/200x200/e8f5e9/4caf50?text=🌿'}
                    alt={fav.shop.shop_name}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-gray-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/200x200/e8f5e9/4caf50?text=🌿';
                    }}
                  />

                  {/* Middle Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate text-sm">
                      {fav.shop.shop_name}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        fav.shop.is_open_now
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {fav.shop.is_open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                    </span>
                    {fav.shop.min_price && (
                      <p className="text-green-500 font-bold text-sm mt-1">
                        เริ่มต้น ฿{fav.shop.min_price}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(e, fav)}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors active:scale-95"
                    aria-label="ลบออกจากรายการโปรด"
                  >
                    <span className="material-symbols-outlined text-red-400 text-[22px] [font-variation-settings:'FILL'_1]">
                      favorite
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}
