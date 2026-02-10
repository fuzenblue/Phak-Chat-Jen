import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { mapsApi } from '../services/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
};

const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok

const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#0e1626' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
];

function MapPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [loading, setLoading] = useState(false);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const response = await mapsApi.searchPlaces(searchQuery);
            if (response.results && response.results.length > 0) {
                setPlaces(response.results);
                const first = response.results[0];
                if (first.geometry?.location) {
                    setMapCenter(first.geometry.location);
                }
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onMapLoad = useCallback((map) => {
        // Map loaded
    }, []);

    if (!isLoaded) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-96">
                    <div className="text-slate-400 flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading Google Maps...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    🗺️ Google Maps Explorer
                </h1>
                <p className="text-slate-400 mt-1 text-sm">Search places and explore the map</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาสถานที่... (เช่น ร้านอาหาร, วัด, โรงพยาบาล)"
                    className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-sm hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25"
                >
                    {loading ? 'กำลังค้นหา...' : '🔍 ค้นหา'}
                </button>
            </form>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className="lg:col-span-2 h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={13}
                        onLoad={onMapLoad}
                        options={{ styles: darkMapStyle, disableDefaultUI: false }}
                    >
                        {places.map((place, i) => (
                            <Marker
                                key={i}
                                position={place.geometry?.location}
                                onClick={() => setSelectedPlace(place)}
                            />
                        ))}
                        {selectedPlace && (
                            <InfoWindow
                                position={selectedPlace.geometry?.location}
                                onCloseClick={() => setSelectedPlace(null)}
                            >
                                <div className="text-gray-800 p-1">
                                    <h3 className="font-bold text-sm">{selectedPlace.name}</h3>
                                    <p className="text-xs mt-1">{selectedPlace.formatted_address}</p>
                                    {selectedPlace.rating && (
                                        <p className="text-xs mt-1">⭐ {selectedPlace.rating}</p>
                                    )}
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>

                {/* Results List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {places.length === 0 ? (
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
                            <p className="text-slate-400 text-sm">ค้นหาสถานที่เพื่อดูผลลัพธ์</p>
                        </div>
                    ) : (
                        places.map((place, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setSelectedPlace(place);
                                    if (place.geometry?.location) {
                                        setMapCenter(place.geometry.location);
                                    }
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedPlace?.place_id === place.place_id
                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <h3 className="text-sm font-semibold text-white truncate">{place.name}</h3>
                                <p className="text-xs text-slate-400 mt-1 truncate">{place.formatted_address}</p>
                                {place.rating && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="text-yellow-400 text-xs">⭐ {place.rating}</span>
                                        <span className="text-slate-500 text-xs">({place.user_ratings_total})</span>
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MapPage;
