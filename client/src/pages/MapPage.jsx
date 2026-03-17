import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const MAP_CENTER = { lat: 13.7274, lng: 100.5230 }; // Khlong Toei

const MOCK_SHOPS = [
  {
    id: 's-001',
    name: 'ป้าแดงผักสดคลองเตย',
    lat: 13.7274,
    lng: 100.5230,
    min_price: 25,
    distance: '150ม.',
    items_count: 5,
    image_url: 'https://images.unsplash.com/photo-1488459711621-27bef697b055?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 's-002',
    name: 'สวนผักลุงสมบัติดี',
    lat: 13.7290,
    lng: 100.5250,
    min_price: 15,
    distance: '450ม.',
    items_count: 8,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 's-003',
    name: 'ร้านผักออร์แกนิก เจ๊พร',
    lat: 13.7250,
    lng: 100.5210,
    min_price: 45,
    distance: '600ม.',
    items_count: 12,
    image_url: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 's-004',
    name: 'กะหล่ำปลีสายน้ำผึ้ง',
    lat: 13.7310,
    lng: 100.5280,
    min_price: 20,
    distance: '1.2กม.',
    items_count: 3,
    image_url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 's-005',
    name: 'ผักตลาดเช้ายิ้มสู้',
    lat: 13.7230,
    lng: 100.5260,
    min_price: 12,
    distance: '850ม.',
    items_count: 6,
    image_url: 'https://images.unsplash.com/photo-1488459711621-27bef697b055?q=80&w=200&auto=format&fit=crop'
  }
];

const RADIUS_OPTIONS = ['500ม.', '1กม.', '3กม.', 'ทั้งหมด'];

export default function MapPage() {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(15);
  const [selectedRadius, setSelectedRadius] = useState('ทั้งหมด');
  const [search, setSearch] = useState('');
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onShopClick = (id) => {
    navigate(`/shops/${id}`);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 20));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1));

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 font-prompt">
        <span className="material-symbols-outlined animate-spin text-green-500 text-[40px]">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden font-prompt">
      {/* Search & Radius Filter Overlay (Top Left) */}
      <div className="absolute top-4 left-4 z-10 space-y-3 pointer-events-none">
        <div className="w-[280px] bg-white rounded-full shadow-lg flex items-center px-4 py-2.5 border border-white pointer-events-auto">
          <span className="material-symbols-outlined text-gray-400 mr-2 text-[22px]">search</span>
          <input 
            type="text" 
            placeholder="ค้นหาประเภทผัก เช่น มะเขือ..."
            className="w-full text-sm outline-none text-gray-700 font-prompt"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-sm font-bold text-gray-600 drop-shadow-sm">ระยะทาง:</span>
          <div className="flex gap-1.5">
            {RADIUS_OPTIONS.map(radius => (
              <button
                key={radius}
                onClick={() => setSelectedRadius(radius)}
                className={`
                  px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm border
                  ${selectedRadius === radius 
                    ? 'bg-green-500 text-white border-green-500 shadow-green-200' 
                    : 'bg-white text-gray-600 border-gray-100 hover:border-green-300'}
                `}
              >
                {radius}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Login Overlay (Top Right) */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto">
        <button 
          onClick={() => navigate('/login')}
          className="bg-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors border border-white"
        >
          <span className="material-symbols-outlined text-green-500 text-[20px]">storefront</span>
          เข้าสู่ระบบสำหรับร้านค้า
        </button>
      </div>

      {/* Zoom Controls Overlay (Right Center) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px] font-bold">add</span>
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px] font-bold">remove</span>
        </button>
      </div>

      {/* Map Content */}
      <GoogleMap
        mapContainerClassName="h-full w-full"
        center={MAP_CENTER}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {MOCK_SHOPS.map(shop => (
          <OverlayView
            key={shop.id}
            position={{ lat: shop.lat, lng: shop.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div 
              onClick={() => onShopClick(shop.id)}
              className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer group"
            >
              {/* Circle Marker */}
              <div className="w-10 h-10 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[20px]">eco</span>
              </div>
              
              {/* Price Label */}
              <div className="mt-1 bg-green-500 text-white rounded-full px-2 py-0.5 text-[10px] font-extrabold shadow-md border border-white font-funnel min-w-[32px] text-center">
                ฿{shop.min_price}
              </div>
              
              {/* Tail */}
              <div className="w-0.5 h-1.5 bg-green-500 shadow-sm" />
            </div>
          </OverlayView>
        ))}
      </GoogleMap>

      {/* Bottom Sheet List (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white rounded-t-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-gray-100 flex flex-col h-[48vh] sm:h-[45vh]">
        <div className="px-6 pt-6 pb-2 shrink-0">
          <h2 className="text-xl font-extrabold text-gray-900 font-prompt">
            ร้านที่เปิดอยู่ใกล้คุณ <span className="text-green-500">({MOCK_SHOPS.length})</span>
          </h2>
        </div>

        <div className="overflow-y-auto px-4 pb-10 divide-y divide-gray-50 flex-1 scrollbar-hide">
          {MOCK_SHOPS.map(shop => (
            <div 
              key={shop.id}
              onClick={() => onShopClick(shop.id)}
              className="flex items-center gap-4 py-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors px-2 rounded-2xl group"
            >
              {/* Shop Image */}
              <img 
                src={shop.image_url} 
                alt={shop.name}
                className="w-16 h-16 rounded-2xl object-cover bg-gray-100 shadow-sm group-hover:scale-105 transition-transform"
              />
              
              {/* Shop Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] text-gray-800 truncate leading-tight mb-0.5">
                  {shop.name}
                </h3>
                <p className="text-xs text-gray-400 mb-1">{shop.items_count} รายการ</p>
                <div className="flex items-baseline gap-0.5 mt-auto">
                   <span className="text-xs text-gray-400 font-medium">เริ่มต้น </span>
                   <span className="text-sm font-black text-green-500 font-funnel">฿{shop.min_price}</span>
                </div>
              </div>

              {/* Status & Distance */}
              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <span className="bg-green-500 text-white rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                  เปิดอยู่
                </span>
                <div className="flex items-center gap-0.5 text-gray-400">
                  <span className="material-symbols-outlined text-[14px]">near_me</span>
                  <span className="text-[11px] font-bold font-funnel">{shop.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}