import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MerchantNavbar from '../components/MerchantNavbar';

const MOCK_PRODUCTS = [
  { 
    id: 1, 
    name: 'กะหล่ำปลี', 
    price: 30, 
    unit: 'หัว', 
    status: 'active', 
    freshness: 'สด',
    freshness_score: 0.9,
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    name: 'มะเขือเทศ', 
    price: 25, 
    unit: 'กก.', 
    status: 'active', 
    freshness: 'สด',
    freshness_score: 0.85,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    name: 'ผักกาดขาว', 
    price: 20, 
    unit: 'หัว', 
    status: 'active', 
    freshness: 'สด',
    freshness_score: 0.95,
    image: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=400&auto=format&fit=crop' 
  },
];

export default function MyProductsPage() {
  const navigate = useNavigate();
//   const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ทั้งหมด');

  const filteredProducts = activeTab === 'ทั้งหมด' 
    ? MOCK_PRODUCTS 
    : activeTab === 'กำลังขาย' 
      ? MOCK_PRODUCTS.filter(p => p.status === 'active')
      : MOCK_PRODUCTS.filter(p => p.status === 'out_of_stock');

  const counts = {
    ทั้งหมด: MOCK_PRODUCTS.length,
    กำลังขาย: MOCK_PRODUCTS.filter(p => p.status === 'active').length,
    หมดแล้ว: MOCK_PRODUCTS.filter(p => p.status === 'out_of_stock').length,
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt">
      {/* Navbar */}
      <MerchantNavbar 
        shopName="ป้าแดงผักสดคลองเตย"
        ownerName="ป้าแดง"
        onLogout={handleLogout}
      />

      <main className="flex-1 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-900 font-funnel tracking-tight">
            สินค้าของฉัน
          </h1>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="h-11 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center gap-2 text-sm sm:text-base">
              <span className="material-symbols-outlined text-[20px]">add</span>
              เพิ่มสินค้า
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 shadow-inner border border-gray-200 overflow-x-auto no-scrollbar">
          {['ทั้งหมด', 'กำลังขาย', 'หมดแล้ว'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                ${activeTab === tab 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-lg text-[10px] ${activeTab === tab ? 'bg-green-100' : 'bg-gray-200 text-gray-500'}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[48px] text-gray-300">storefront</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">ยังไม่มีสินค้า</h3>
            <p className="text-gray-400 text-sm mt-1 mb-8 max-w-[240px]">
              เริ่มต้นเพิ่มสินค้าแรกของคุณ เพื่อแสดงให้ลูกค้าในบริเวณใกล้เคียงเห็น
            </p>
            <button className="w-full max-w-xs h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add</span>
              เพิ่มสินค้าเลย
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm ${
                      product.freshness === 'สด' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {product.freshness} {Math.round(product.freshness_score * 100)}%
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 truncate mb-1">{product.name}</h3>
                    <div className="flex items-baseline gap-1 text-green-600 font-funnel">
                      <span className="text-lg font-extrabold">฿{product.price}</span>
                      <span className="text-xs text-gray-400 font-medium">/{product.unit}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                    แก้ไขสินค้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
