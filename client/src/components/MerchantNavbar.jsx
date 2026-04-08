import React from 'react';

export default function MerchantNavbar({ shopName, ownerName, onLogout }) {
  return (
    <nav className="sticky top-0 z-20 w-full bg-white border-b border-gray-100 shadow-sm h-14 font-prompt">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Left Section - Logo & Store Info */}
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 border-r border-gray-100 pr-4">
            <span className="material-symbols-outlined text-green-500 text-[20px]">eco</span>
            <span className="font-semibold text-green-600 text-[13px] sm:text-sm hidden xs:inline">ผักชัดเจน</span>
          </div>
          
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold text-gray-800 text-sm truncate max-w-[120px] sm:max-w-none">
              {shopName}
            </span>
            <span className="text-gray-300 text-xs hidden sm:inline">|</span>
            <span className="text-sm text-gray-400 truncate hidden sm:inline">
              {ownerName}
            </span>
          </div>
        </div>

        {/* Right Section - Logout */}
        <div className="flex justify-end shrink-0">
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 text-red-400 font-medium text-sm hover:bg-red-50 px-2 sm:px-3 py-1.5 rounded-xl transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">logout</span>
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>

      </div>
    </nav>
  );
}