import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MerchantNavbar({ shopName, ownerName, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-20 w-full bg-white border-b border-gray-100 shadow-sm h-12 md:h-14 font-sarabun">
      <div className="max-w-5xl mx-auto px-2 md:px-4 lg:px-6 h-full flex items-center justify-between gap-1 md:gap-2">
        
        {/* Left Section - Logo & Store Info */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 overflow-hidden min-w-0 flex-1">
          <div className="flex items-center gap-1 md:gap-1.5 shrink-0 border-r border-gray-100 pr-2 md:pr-3 lg:pr-4">
            <span className="material-symbols-outlined text-green-500 text-base md:text-[20px]">eco</span>
            <span className="font-semibold text-green-600 text-[10px] md:text-[13px] lg:text-sm hidden md:inline">ผักชัดเจน</span>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2 overflow-hidden min-w-0 flex-1">
            <span className="font-semibold text-gray-800 text-xs md:text-sm truncate max-w-20 md:max-w-32 lg:max-w-none">
              {shopName}
            </span>
            <span className="text-gray-300 text-[9px] md:text-xs hidden md:inline">|</span>
            <span className="text-xs md:text-sm text-gray-400 truncate hidden md:inline max-w-24 lg:max-w-none">
              {ownerName}
            </span>
          </div>
        </div>

        {/* Right Section - Map & Logout */}
        <div className="flex justify-end gap-1 md:gap-2 shrink-0">
          <button 
            onClick={() => navigate('/map')}
            className="flex items-center gap-1 md:gap-1.5 text-blue-500 font-medium text-xs md:text-sm hover:bg-blue-50 px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl transition-all active:scale-95 group"
            title="แผนที่"
          >
            <span className="material-symbols-outlined text-base md:text-[20px] group-hover:scale-110 transition-transform">location_on</span>
            <span className="hidden md:inline">ดูแผนที่</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-1 md:gap-1.5 text-red-400 font-medium text-xs md:text-sm hover:bg-red-50 px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl transition-all active:scale-95 group"
            title="ออกจากระบบ"
          >
            <span className="material-symbols-outlined text-base md:text-[20px] group-hover:rotate-12 transition-transform">logout</span>
            <span className="hidden md:inline">ออกจากระบบ</span>
          </button>
        </div>

      </div>
    </nav>
  );
}