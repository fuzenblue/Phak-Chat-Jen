import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import FilterPanel from '../components/FilterPanel';
import api from '../services/api';
import { CATEGORIES } from '../constants';

// Snap points: collapsed (80px), half (340px), full (85vh)
const SNAP_HEIGHTS = ['80px', '340px', '85vh'];

export default function MapPage() {
    const navigate = useNavigate();

    // Data & Map State
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(15);
    const [search, setSearch] = useState('');
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 13.7274, lng: 100.5230 });
    const [userLocation, setUserLocation] = useState(null);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [hoveredShopId, setHoveredShopId] = useState(null);
    const [snapIndex, setSnapIndex] = useState(1); // 0=collapsed, 1=half, 2=full

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [distanceRange, setDistanceRange] = useState([0, 20]); // in km
    const [shopStatus, setShopStatus] = useState('ทั้งหมด'); 

    // Applied Filters (only updated when Search button is clicked)
    const [appliedCategory, setAppliedCategory] = useState('ทั้งหมด');
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 500]);
    const [appliedDistanceRange, setAppliedDistanceRange] = useState([0, 20]);
    const [appliedShopStatus, setAppliedShopStatus] = useState('ทั้งหมด');
    const [hasAppliedFilters, setHasAppliedFilters] = useState(false); // Track if any filters have been applied
    
    // Refs for selected-card scroll
    const cardRefs = useRef({});
    const listRef = useRef(null);
    const userLocationRef = useRef(null); // Store initial location, don't use as state dependency

    // Format distance for display
    const formatDistance = (meters) => {
        if (!meters) return 'N/A';
        if (meters < 1000) return `${meters} ม.`;
        return `${(meters / 1000).toFixed(1)} กม.`;
    };

    // Convert distance string to km for filtering
    const getDistanceInKm = (distanceStr) => {
        if (!distanceStr || distanceStr === 'N/A') return 0;
        
        const value = parseFloat(distanceStr);
        
        if (distanceStr.includes('กม.')) {
            return value; // already in km
        } else if (distanceStr.includes('ม.')) {
            return value / 1000; // convert meters to km
        }
        
        return 0;
    };

    // Filter shops based on APPLIED criteria
    const filteredShops = shops.filter(shop => {
        // If no filters have been applied, show all shops
        if (!hasAppliedFilters) {
            // Still apply search filter
            if (search && !shop.name.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            return true;
        }

        // Shop status filter
        if (appliedShopStatus === 'เปิดอยู่เท่านั้น' && !shop.is_open) {
            return false;
        }

        // Search filter
        if (search && !shop.name.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        // Price filter
        if (shop.min_price < appliedPriceRange[0] || shop.min_price > appliedPriceRange[1]) {
            return false;
        }

        // Distance filter
        const distanceInKm = getDistanceInKm(shop.distance);
        if (distanceInKm > appliedDistanceRange[1]) {
            return false;
        }

        return true;
    });

    // Fetch shops function (can be reused for both initial load and filter application)
    const fetchShopsWithFilters = useCallback(async (lat, lng, vegType) => {
        try {
            setLoading(true);
            const radius = 20000; // Fixed 20km radius
            console.log('Fetching shops from:', { lat, lng, radius, vegType });
            const response = await api.get('shops/nearby', {
                params: { 
                    lat, 
                    lng, 
                    radius,
                    veg_type: vegType || undefined
                }
            });
            
            console.log('Shops received:', response.data.data);
            const formattedShops = response.data.data.map(s => {
                const distFormatted = formatDistance(s.distance_meters);
                console.log(`${s.shop_name}: ${s.distance_meters}m = ${distFormatted}`);
                return {
                    id: s.id,
                    name: s.shop_name,
                    lat: s.latitude,
                    lng: s.longitude,
                    min_price: s.min_price || 0,
                    items_count: s.post_count,
                    image_url: s.shop_image_url,
                    distance: distFormatted,
                    is_open: s.is_open_now,
                    opening_hours: s.opening_hours,
                };
            });
            setShops(formattedShops);
        } catch (err) {
            console.error('Fetch shops failed:', err);
            setShops([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch shops + geolocation (only once on mount)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                console.log('Geolocation found:', { latitude, longitude });
                // Store in ref (doesn't trigger state updates on location changes)
                userLocationRef.current = { lat: latitude, lng: longitude };
                // Update center for map display
                setCenter({ lat: latitude, lng: longitude });
                setUserLocation({ lat: latitude, lng: longitude });
                // Fetch shops only once with this location (no category filter)
                fetchShopsWithFilters(latitude, longitude);
            }, (error) => {
                console.error('Geolocation error:', error);
                // Fallback to Bangkok center if geolocation fails
                userLocationRef.current = { lat: 13.7274, lng: 100.5230 };
                fetchShopsWithFilters(13.7274, 100.5230);
            });
        } else {
            console.warn('Geolocation not supported');
            // Fallback if geolocation not supported
            userLocationRef.current = { lat: 13.7274, lng: 100.5230 };
            fetchShopsWithFilters(13.7274, 100.5230);
        }
    }, [fetchShopsWithFilters]);

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

    // Center map on user location
    const handleCenterOnUser = () => {
        if (userLocation && map) {
            map.panTo(userLocation);
            setZoom(18);
        }
    };

    // Apply filters and close panel
    const handleApplyFilters = () => {
        setAppliedCategory(selectedCategory);
        setAppliedPriceRange([...priceRange]);
        setAppliedDistanceRange([...distanceRange]);
        setAppliedShopStatus(shopStatus);
        setHasAppliedFilters(true);
        setShowFilters(false);
        
        // Refetch shops with the selected category
        if (userLocationRef.current) {
            const vegType = selectedCategory !== 'ทั้งหมด' ? selectedCategory : undefined;
            fetchShopsWithFilters(userLocationRef.current.lat, userLocationRef.current.lng, vegType);
        }
    };

    // Remove individual filters
    const removeFilterTag = (filterType) => {
        if (filterType === 'category') {
            setAppliedCategory('ทั้งหมด');
            setSelectedCategory('ทั้งหมด');
        } else if (filterType === 'price') {
            setAppliedPriceRange([0, 500]);
            setPriceRange([0, 500]);
        } else if (filterType === 'distance') {
            setAppliedDistanceRange([0, 20]);
            setDistanceRange([0, 20]);
        } else if (filterType === 'status') {
            setAppliedShopStatus('ทั้งหมด');
            setShopStatus('ทั้งหมด');
        }
        
        // If all filters are reset to default, mark as no filters applied
        const newCategory = filterType === 'category' ? 'ทั้งหมด' : appliedCategory;
        const newPrice = filterType === 'price' ? [0, 500] : appliedPriceRange;
        const newDistance = filterType === 'distance' ? [0, 20] : appliedDistanceRange;
        const newStatus = filterType === 'status' ? 'ทั้งหมด' : appliedShopStatus;
        
        const allDefault = newCategory === 'ทั้งหมด' && 
                         newPrice[0] === 0 && newPrice[1] === 500 && 
                         newDistance[1] === 20 && 
                         newStatus === 'ทั้งหมด';
        
        if (allDefault) {
            setHasAppliedFilters(false);
        }
    };

    // Reset all filters
    const handleResetAllFilters = () => {
        setSearch('');
        setSelectedCategory('ทั้งหมด');
        setPriceRange([0, 500]);
        setDistanceRange([0, 20]);
        setShopStatus('ทั้งหมด');
        setAppliedCategory('ทั้งหมด');
        setAppliedPriceRange([0, 500]);
        setAppliedDistanceRange([0, 20]);
        setAppliedShopStatus('ทั้งหมด');
        setHasAppliedFilters(false);
    };

    // Get opening time for shop
    const getOpeningTime = (openingHours) => {
        if (!openingHours) return 'ไม่ระบุ';
        try {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const dayMap = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
            const dayKey = dayMap[today] || 'Mon';
            const dayHours = openingHours[dayKey];
            if (dayHours && dayHours.open && dayHours.close) {
                return `${dayHours.open} - ${dayHours.close}`;
            }
        } catch (err) {
            console.error('Error parsing opening hours:', err);
        }
        return 'ไม่ระบุ';
    };

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
                {/* User Current Location Marker */}
                {userLocation && (
                    <OverlayView
                        position={userLocation}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                            {/* Pulse ring */}
                            <div className="absolute w-12 h-12 border-2 border-blue-400 rounded-full animate-pulse opacity-50"></div>
                            {/* Center dot */}
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                        </div>
                    </OverlayView>
                )}

                {/* Shop Markers */}
                {filteredShops.map(shop => (
                    <OverlayView
                        key={shop.id}
                        position={{ lat: shop.lat, lng: shop.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div 
                            onClick={() => handleMarkerClick(shop)}
                            onMouseEnter={() => setHoveredShopId(shop.id)}
                            onMouseLeave={() => setHoveredShopId(null)}
                            className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer group">
                            <div className={`w-12 h-12 rounded-full border-3 border-white shadow-lg overflow-hidden group-hover:scale-110 transition-transform ${
                                    selectedShopId === shop.id
                                        ? 'ring-2 ring-emerald-600 scale-110'
                                        : ''
                                }`}
                            >
                                <img 
                                    src={shop.image_url || 'https://placehold.co/48x48/e8f5e9/4caf50?text=🌿'}
                                    alt={shop.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="mt-1 bg-green-500 text-white rounded-full px-2 py-0.5 text-[10px] font-extrabold shadow-md border border-white font-funnel min-w-[32px] text-center">
                                ฿{shop.min_price}
                            </div>
                            <div className="w-0.5 h-1.5 bg-green-500 shadow-sm" />

                            {/* Hover Card - positioned to the right with highest z-index */}
                            {hoveredShopId === shop.id && (
                                <div className="card bg-white shadow-2xl absolute right-5 top-1/2 -translate-y-1/2 z-[9999] w-64 cursor-default font-sarabun" onClick={(e) => e.stopPropagation()}>
                                    <figure className="px-3 pt-3">
                                        <img 
                                            src={shop.image_url || 'https://placehold.co/300x200/e8f5e9/4caf50'}
                                            alt={shop.name}
                                            className="rounded-lg object-cover h-32 w-full"
                                        />
                                    </figure>
                                    <div className="card-body p-3">
                                        <h2 className="card-title text-base font-sarabun">{shop.name}</h2>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-green-500 text-[16px]">schedule</span>
                                                <span className="font-semibold">เวลาเปิด:</span>
                                                <span>{getOpeningTime(shop.opening_hours)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-500 text-[16px]">distance</span>
                                                <span className="font-semibold">ระยะทาง:</span>
                                                <span>{shop.distance}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-500 text-[16px]">local_offer</span>
                                                <span className="font-semibold">ราคา:</span>
                                                <span>฿{shop.min_price}</span>
                                            </div>
                                            <div className="flex items-center gap-2 pt-1">
                                                <span className={`material-symbols-outlined text-[16px] ${shop.is_open ? 'text-green-500' : 'text-gray-400'}`}>
                                                    {shop.is_open ? 'check_circle' : 'cancel'}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${shop.is_open ? 'bg-green-500' : 'bg-gray-400'}`}>
                                                    {shop.is_open ? 'เปิด' : 'ปิด'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-actions justify-end mt-2">
                                            <button 
                                                onClick={() => navigate(`/shops/${shop.id}`)}
                                                className="btn btn-primary btn-xs font-sarabun"
                                            >
                                                ดูสินค้า
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </OverlayView>
                ))}
            </GoogleMap>

            {/* Filter Panel Component */}
            <FilterPanel
                search={search}
                setSearch={setSearch}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                distanceRange={distanceRange}
                setDistanceRange={setDistanceRange}
                shopStatus={shopStatus}
                setShopStatus={setShopStatus}
                appliedCategory={appliedCategory}
                appliedPriceRange={appliedPriceRange}
                appliedDistanceRange={appliedDistanceRange}
                appliedShopStatus={appliedShopStatus}
                hasAppliedFilters={hasAppliedFilters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetAllFilters}
                onRemoveFilterTag={removeFilterTag}
            />

            {/* Zoom controls (right-center) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
                <button onClick={handleZoomIn} className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[22px]">add</span>
                </button>
                <button onClick={handleZoomOut} className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[22px]">remove</span>
                </button>
                <button 
                    onClick={handleCenterOnUser} 
                    className="w-10 h-10 bg-blue-500 rounded-xl shadow-md flex items-center justify-center text-white hover:bg-blue-600 transition-all active:scale-95"
                    title="ตำแหน่งของฉัน"
                >
                    <span className="material-symbols-outlined text-[22px]">my_location</span>
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
                        <span className="text-green-500">({filteredShops.length})</span>
                    </h2>
                </div>

                {/* Shop list */}
                <div
                    ref={listRef}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y divide-y divide-gray-50"
                >
                    {filteredShops.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 text-sm">ไม่พบร้านค้าที่ตรงกับตัวกรอง</div>
                    ) : (
                        filteredShops.map(shop => {
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