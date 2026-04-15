import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import api from '../services/api';

const RADIUS_OPTIONS = ['500ม.', '1กม.', '3กม.', 'ทั้งหมด'];

// Snap points: collapsed (80px), half (340px), full (85vh)
const SNAP_HEIGHTS = ['80px', '340px', '85vh'];

export default function MapPage() {
    const navigate = useNavigate();

    // Data & Map State
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(15);
    const [selectedRadius, setSelectedRadius] = useState('ทั้งหมด');
    const [search, setSearch] = useState('');
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 13.7274, lng: 100.5230 });

    // New: selected shop for marker → card highlight
    const [selectedShopId, setSelectedShopId] = useState(null);

    // Bottom Sheet Snap
    const [snapIndex, setSnapIndex] = useState(1); // 0=collapsed, 1=half, 2=full

    // Refs for selected-card scroll
    const cardRefs = useRef({});
    const listRef = useRef(null);

    // Fetch shops + geolocation
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await api.get('shops');
                setShops(response.data.data);
            } catch (err) {
                console.error('Fetch shops failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }
    }, []);

    // Scroll highlighted card into view when selectedShopId changes
    useEffect(() => {
        if (selectedShopId && cardRefs.current[selectedShopId]) {
            cardRefs.current[selectedShopId].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedShopId]);

    // Google Maps API
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    // Handlers
    const handleZoomIn  = () => setZoom(prev => Math.min(prev + 1, 20));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1));

    const handleMarkerClick = (shop) => {
        if (map) {
            map.panTo({ lat: shop.lat, lng: shop.lng });
        }
        setSelectedShopId(shop.id);
        // Expand bottom sheet to half if collapsed
        setSnapIndex(prev => Math.max(prev, 1));
    };

    const handleShopCardClick = (id) => {
        navigate(`/shops/${id}`);
    };

    // Loading Screen
    if (!isLoaded) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 font-prompt">
                <span className="material-symbols-outlined animate-spin text-green-500 text-[40px]">
                    progress_activity
                </span>
            </div>
        );
    }

    // Render
    return (
        <div className="h-screen w-full relative overflow-hidden font-prompt">
            <CustomerNavbar title="แผนที่ร้านค้า" />

            <GoogleMap
                mapContainerClassName="h-full w-full"
                center={center}
                zoom={zoom}
                onLoad={onMapLoad}
                options={{
                    disableDefaultUI: true,
                    clickableIcons: false,
                    styles: [
                        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
                    ],
                }}
            >
                {shops.map(shop => (
                    <OverlayView
                        key={shop.id}
                        position={{ lat: shop.lat, lng: shop.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div onClick={() => handleMarkerClick(shop)}
                            className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer group">
                            <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                                    selectedShopId === shop.id
                                        ? 'bg-emerald-600 scale-110'
                                        : 'bg-green-500'
                                }`}
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">eco</span>
                            </div>
                            <div className="mt-1 bg-green-500 text-white rounded-full px-2 py-0.5 text-[10px] font-extrabold shadow-md border border-white font-funnel min-w-[32px] text-center">
                                ฿{shop.min_price}
                            </div>
                            <div className="w-0.5 h-1.5 bg-green-500 shadow-sm" />
                        </div>
                    </OverlayView>
                ))}
            </GoogleMap>

            {/* overlay: search bar + radius pills */}
            <div className="absolute top-16 left-70 z-10 flex flex-col gap-2">

                {/* Search bar */}
                <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-2 w-72">
                    <span className="material-symbols-outlined text-gray-400 text-[22px] shrink-0">search</span>
                    <input
                        type="text"
                        placeholder="ค้นหาผักที่ต้องการ"
                        className="w-full text-sm outline-none text-gray-700 bg-transparent font-prompt placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Radius pills */}
                <div className="flex gap-2 flex-wrap">
                    {RADIUS_OPTIONS.map(radius => (
                        <button
                            key={radius}
                            onClick={() => setSelectedRadius(radius)}
                            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                selectedRadius === radius
                                    ? 'bg-green-500 text-white shadow-sm'
                                    : 'bg-white text-gray-600 shadow-sm hover:bg-green-50'
                            }`}
                        >
                            {radius}
                        </button>
                    ))}
                </div>
            </div>

            {/* Zoom controls (right-center) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
                <button onClick={handleZoomIn} className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[22px]">add</span>
                </button>
                <button onClick={handleZoomOut} className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[22px]">remove</span>
                </button>
            </div>

            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-70 right-70 z-20 bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.1)] flex flex-col transition-all duration-500 ease-in-out"
                style={{ height: SNAP_HEIGHTS[snapIndex] }} >
                {/* Drag handle row */}
                <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0">
                    {/* Pill handle */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full mt-1" />

                    {/* Snap control buttons (right side) */}
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => setSnapIndex(prev => Math.max(0, prev - 1))}
                            disabled={snapIndex === 0}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                                snapIndex === 0
                                    ? 'bg-gray-50 text-gray-300'
                                    : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 active:scale-95 shadow-sm'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[22px]">keyboard_arrow_down</span>
                        </button>
                        <button
                            onClick={() => setSnapIndex(prev => Math.min(2, prev + 1))}
                            disabled={snapIndex === 2}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                                snapIndex === 2
                                    ? 'bg-gray-100 text-gray-300'
                                    : 'bg-green-500 text-white hover:bg-green-600 active:scale-95 shadow-md shadow-green-100'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[22px]">keyboard_arrow_up</span>
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="px-10 pt-2 pb-3 shrink-0">
                    <h2 className="font-bold text-gray-900 text-base">
                        ร้านที่เปิดอยู่ใกล้คุณ{' '}
                        <span className="text-green-500">({shops.length})</span>
                    </h2>
                </div>

                {/* Shop list */}
                <div
                    ref={listRef}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y divide-y divide-gray-50"
                >
                    {shops.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 text-sm">ไม่พบร้านค้าในขณะนี้</div>
                    ) : (
                        shops.map(shop => {
                            const isSelected = shop.id === selectedShopId;
                            return (
                                <div
                                    key={shop.id}
                                    ref={el => { cardRefs.current[shop.id] = el; }}
                                    onClick={() => handleShopCardClick(shop.id)}
                                    className={`px-10 py-3 flex gap-3 items-center hover:bg-gray-50 cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'bg-green-50 border-l-4 border-green-500'
                                            : 'border-l-4 border-transparent'
                                    }`}
                                >
                                    {/* Shop image */}
                                    <img
                                        src={shop.image_url || 'https://placehold.co/150x150/e8f5e9/4caf50?text=🌿'}
                                        alt={shop.name}
                                        className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 bg-gray-100"
                                    />

                                    {/* Middle info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-800 truncate">{shop.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{shop.items_count} รายการ</p>
                                        <p className="text-sm font-bold text-green-500 mt-0.5">
                                            เริ่มต้น ฿{shop.min_price}
                                        </p>
                                    </div>

                                    {/* Right: badge + distance */}
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span
                                            className={`text-[10px] rounded-full px-2 py-0.5 font-semibold text-white ${
                                                shop.is_open ? 'bg-green-500' : 'bg-gray-400'
                                            }`}
                                        >
                                            {shop.is_open ? 'เปิดอยู่' : 'ปิดอยู่'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {shop.distance || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {/* Bottom padding for last item */}
                    <div className="h-6" />
                </div>
            </div>
        </div>
    );
}