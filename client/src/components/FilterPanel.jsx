import { CATEGORIES } from '../constants';

export default function FilterPanel({
    search,
    setSearch,
    showFilters,
    setShowFilters,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    distanceRange,
    setDistanceRange,
    shopStatus,
    setShopStatus,
    appliedCategory,
    appliedPriceRange,
    appliedDistanceRange,
    appliedShopStatus,
    hasAppliedFilters,
    onApplyFilters,
    onResetFilters,
    onRemoveFilterTag,
}) {
    return (
        <div className="absolute top-16 left-4 md:left-6 right-4 md:left-auto z-10 flex flex-col gap-2">
            {/* Search bar + Filter button + Search button */}
            <div className="flex gap-2 items-stretch flex-col md:flex-row">
                <div className="bg-white rounded-xl md:rounded-2xl shadow-md px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 flex-1 order-2 md:order-1">
                    <span className="material-symbols-outlined text-gray-400 text-[20px] md:text-[22px] shrink-0">search</span>
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        className="w-full text-xs md:text-sm outline-none text-gray-700 bg-transparent font-prompt placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {/* Filter button (tune icon) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-10 md:w-11 h-10 md:h-11 rounded-xl md:rounded-2xl shadow-md flex items-center justify-center transition-all order-1 md:order-2 shrink-0 ${
                        showFilters
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <span className="material-symbols-outlined text-[20px] md:text-[22px]">tune</span>
                </button>

                {/* Search button */}
                <button
                    onClick={onApplyFilters}
                    className="px-3 md:px-4 py-2 bg-green-500 text-white rounded-xl md:rounded-2xl shadow-md hover:bg-green-600 transition-all active:scale-95 font-medium text-xs md:text-sm order-3 md:order-3 shrink-0"
                >
                    ค้นหา
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-3 md:p-4 space-y-3 md:space-y-4 max-w-full md:w-96 max-h-96 overflow-y-auto">
                    {/* Shop Status Filter */}
                    <div>
                        <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase">สถานะร้าน</label>
                        <select
                            value={shopStatus}
                            onChange={(e) => setShopStatus(e.target.value)}
                            className="select select-bordered w-full mt-2 text-xs md:text-sm"
                        >
                            <option value="ทั้งหมด">ทั้งหมด</option>
                            <option value="เปิดอยู่เท่านั้น">เปิดอยู่เท่านั้น</option>
                        </select>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Category Filter */}
                    <div>
                        <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase">หมวดหมู่ผัก</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="select select-bordered w-full mt-2 text-xs md:text-sm"
                        >
                            <option value="ทั้งหมด">ทั้งหมด</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.emoji} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Price Range Filter */}
                    <div>
                        <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase">ราคา</label>
                        <div className="flex flex-col lg:flex-row gap-2 lg:gap-2 items-center mt-3">
                            {/* Min Price Input */}
                            <div className="flex-1 w-full">
                                <label className="text-[9px] md:text-[10px] text-gray-500">ต่ำสุด</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="500"
                                    value={priceRange[0]}
                                    onChange={(e) => {
                                        const newMin = Math.min(parseInt(e.target.value) || 0, priceRange[1]);
                                        setPriceRange([newMin, priceRange[1]]);
                                    }}
                                    className="input input-bordered input-xs md:input-sm w-full text-xs md:text-sm"
                                    placeholder="0"
                                />
                            </div>
                            
                            {/* Divider */}
                            <div className="divider divider-horizontal my-0 hidden lg:flex">-</div>
                            <div className="text-gray-400 lg:hidden text-xs">-</div>

                            {/* Max Price Input */}
                            <div className="flex-1 w-full">
                                <label className="text-[9px] md:text-[10px] text-gray-500">สูงสุด</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="500"
                                    value={priceRange[1]}
                                    onChange={(e) => {
                                        const newMax = Math.max(parseInt(e.target.value) || 500, priceRange[0]);
                                        setPriceRange([priceRange[0], newMax]);
                                    }}
                                    className="input input-bordered input-xs md:input-sm w-full text-xs md:text-sm"
                                    placeholder="500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Distance Range Filter */}
                    <div>
                        <label className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase">
                            ระยะทาง {distanceRange[1]} กม.
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="7"
                            step="1"
                            value={[0, 1, 3, 5, 10, 15, 20, 30].indexOf(distanceRange[1])}
                            onChange={(e) => {
                                const distances = [0, 1, 3, 5, 10, 15, 20, 30];
                                setDistanceRange([0, distances[parseInt(e.target.value)]]);
                            }}
                            className="range range-xs range-success w-full mt-2"
                        />
                        <div className="flex justify-between text-[8px] md:text-xs text-gray-400 mt-2 px-1">
                            <span>0 km</span>
                            <span>1</span>
                            <span>3</span>
                            <span>5</span>
                            <span>10</span>
                            <span>15</span>
                            <span>20</span>
                            <span>30 km</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Reset button */}
                    <button
                        onClick={onResetFilters}
                        className="w-full py-2 text-xs md:text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        รีเซ็ตตัวกรอง
                    </button>

                    {/* Search button */}
                    <button
                        onClick={onApplyFilters}
                        className="w-full py-2 text-xs md:text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">search</span>
                        ค้นหา
                    </button>
                </div>
            )}

            {/* Applied Filter Tags */}
            {hasAppliedFilters && (appliedCategory !== 'ทั้งหมด' || appliedPriceRange[0] !== 0 || appliedPriceRange[1] !== 500 || appliedDistanceRange[1] !== 20 || appliedShopStatus !== 'ทั้งหมด') && (
                <div className="flex gap-1.5 md:gap-2 flex-wrap">
                    {appliedShopStatus !== 'ทั้งหมด' && (
                        <div className="bg-yellow-100 text-yellow-700 px-2.5 md:px-3 py-1 rounded-full text-[11px] md:text-xs font-medium flex items-center gap-1.5 md:gap-2">
                            {appliedShopStatus}
                            <button
                                onClick={() => onRemoveFilterTag('status')}
                                className="hover:text-yellow-900 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px] md:text-[16px]">close</span>
                            </button>
                        </div>
                    )}
                    {appliedCategory !== 'ทั้งหมด' && (
                        <div className="bg-green-100 text-green-700 px-2.5 md:px-3 py-1 rounded-full text-[11px] md:text-xs font-medium flex items-center gap-1.5 md:gap-2">
                            {appliedCategory}
                            <button
                                onClick={() => onRemoveFilterTag('category')}
                                className="hover:text-green-900 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px] md:text-[16px]">close</span>
                            </button>
                        </div>
                    )}
                    {(appliedPriceRange[0] !== 0 || appliedPriceRange[1] !== 500) && (
                        <div className="bg-blue-100 text-blue-700 px-2.5 md:px-3 py-1 rounded-full text-[11px] md:text-xs font-medium flex items-center gap-1.5 md:gap-2">
                            ฿{appliedPriceRange[0]} - ฿{appliedPriceRange[1]}
                            <button
                                onClick={() => onRemoveFilterTag('price')}
                                className="hover:text-blue-900 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px] md:text-[16px]">close</span>
                            </button>
                        </div>
                    )}
                    {appliedDistanceRange[1] !== 20 && (
                        <div className="bg-purple-100 text-purple-700 px-2.5 md:px-3 py-1 rounded-full text-[11px] md:text-xs font-medium flex items-center gap-1.5 md:gap-2">
                            {appliedDistanceRange[1]} กม.
                            <button
                                onClick={() => onRemoveFilterTag('distance')}
                                className="hover:text-purple-900 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
