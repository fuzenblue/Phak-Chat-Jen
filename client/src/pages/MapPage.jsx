import { useState, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const MOCK_SHOPS = [
  {
    id: 's-001',
    shop_name: 'ป้าแดงผักสด',
    latitude: 13.7563,
    longitude: 100.5018,
    is_open_now: true,
    min_price: 20,
    post_count: 3,
    preview_image_url: null,
    veg_types: ['ผักกาดขาว', 'มะเขือเทศ'],
  },
  {
    id: 's-002',
    shop_name: 'สวนผักลุงสม',
    latitude: 13.7600,
    longitude: 100.5080,
    is_open_now: true,
    min_price: 15,
    post_count: 5,
    preview_image_url: null,
    veg_types: ['ผักบุ้ง', 'คะน้า'],
  },
  {
    id: 's-003',
    shop_name: 'ผักสดนายทุน',
    latitude: 13.7520,
    longitude: 100.4950,
    is_open_now: false,
    min_price: 25,
    post_count: 2,
    preview_image_url: null,
    veg_types: ['มะเขือเทศ'],
  },
];

const VEG_FILTERS = ['ทั้งหมด', 'ผักกาดขาว', 'มะเขือเทศ', 'ผักบุ้ง', 'คะน้า'];

const MAP_CENTER = { lat: 13.7563, lng: 100.5018 };

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('ทั้งหมด');
  const [selectedShop, setSelectedShop] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const filteredShops = selectedFilter === 'ทั้งหมด'
    ? MOCK_SHOPS
    : MOCK_SHOPS.filter(s => s.veg_types.includes(selectedFilter));

  const onLoad = useCallback(mapInstance => setMap(mapInstance), []);

  function handleMarkerClick(shop) {
    setSelectedShop(shop);
    map?.panTo({ lat: shop.latitude, lng: shop.longitude });
  }

  function handleShopCardClick(shop) {
    navigate(`/shops/${shop.id}`);
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {VEG_FILTERS.map(filter => (
            <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`
                flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                ${selectedFilter === filter
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}
                `}
            >
                {filter}
            </button>
            ))}
        </div>
        </div>

      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={MAP_CENTER}
        zoom={14}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        }}
        onClick={() => setSelectedShop(null)}
      >
        {filteredShops.map(shop => (
          <Marker
            key={shop.id}
            position={{ lat: shop.latitude, lng: shop.longitude }}
            onClick={() => handleMarkerClick(shop)}
            icon={{
              url: shop.is_open_now
                ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/grey.png',
            }}
          />
        ))}

        {selectedShop && (
          <InfoWindow
            position={{ lat: selectedShop.latitude, lng: selectedShop.longitude }}
            onCloseClick={() => setSelectedShop(null)}
          >
            <div className="p-1 min-w-[140px]">
              <p className="font-semibold text-sm text-gray-800">
                {selectedShop.shop_name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedShop.is_open_now
                  ? 'เปิดอยู่'
                  : 'ปิดแล้ว'}
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                เริ่มต้น ฿{selectedShop.min_price}
              </p>
              <button
                onClick={() => handleShopCardClick(selectedShop)}
                className="mt-2 w-full text-xs bg-green-500 text-white rounded-lg py-1 hover:bg-green-600"
              >
                ดูร้าน
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className={`absolute left-0 right-0 bottom-0 z-10 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ${bottomSheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'}`}>
        <div className="flex flex-col items-center pt-3 pb-2 cursor-pointer" onClick={() => setBottomSheetOpen(prev => !prev)}>
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
          <p className="text-xs text-gray-400 mt-1">
            {filteredShops.length} ร้านในบริเวณนี้
          </p>
        </div>

        <div className="overflow-y-auto max-h-64 px-4 pb-6 space-y-3">
          {filteredShops.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">
              ไม่พบร้านค้าในบริเวณนี้
            </p>
          ) : (
            filteredShops.map(shop => (
              <div
                key={shop.id}
                onClick={() => handleShopCardClick(shop)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-300 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🥬</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {shop.shop_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {shop.post_count} รายการ · เริ่มต้น ฿{shop.min_price}
                  </p>
                </div>

                <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${shop.is_open_now ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {shop.is_open_now ? 'เปิด' : 'ปิด'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}