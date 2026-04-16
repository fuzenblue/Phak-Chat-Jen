import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerNavbar({ title, back = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const avatarLetter = user?.email
    ? user.email[0].toUpperCase()
    : '?';

  const menuItem = (icon, label, onClick, danger = false) => (
    <button
      onClick={() => { setDropdownOpen(false); onClick(); }}
      className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm hover:bg-gray-50 transition-colors ${
        danger ? 'text-red-500' : 'text-gray-700'
      }`}
    >
      <span className={`material-symbols-outlined text-base md:text-[18px] ${danger ? 'text-red-400' : 'text-gray-400'}`}>
        {icon}
      </span>
      {label}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 shadow-sm h-12 md:h-14 font-sarabun">
      <div className="max-w-5xl mx-auto px-2 md:px-4 lg:px-6 h-12 md:h-14 flex items-center justify-between gap-1 md:gap-2">

        {/* Left: logo or back */}
        {/* Left: logo or back */}
        <div className="w-1/3 flex justify-start">
          {back ? (
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors focus:outline-none">
              <span className="material-symbols-outlined text-base md:text-[20px]">arrow_back</span>
              <span className="text-[11px] md:text-sm font-medium hidden md:inline">ย้อนกลับ</span>
            </button>
          ) : (
            <button onClick={() => navigate('/')} className="flex items-center gap-1 md:gap-1.5 shrink-0 overflow-hidden focus:outline-none">
              <span className="material-symbols-outlined text-green-500 text-base md:text-[20px] shrink-0">eco</span>
              <span className="font-bold text-green-600 text-[11px] md:text-sm tracking-tight truncate">ผักชัดเจน</span>
            </button>
          )}
        </div>

        {/* Center: title */}
        <div className="flex-1 flex justify-center overflow-hidden px-1 md:px-2">
          <h1 className="font-bold text-gray-800 text-xs md:text-sm truncate whitespace-nowrap">
            {title || 'Phak Chat Jen'}
          </h1>
        </div>

        {/* Right: login button or avatar + dropdown */}
        <div className="flex justify-end gap-1 md:gap-2 shrink-0">
          {/* Show "ร้านของฉัน" button on map page if user is merchant */}
          {user && location.pathname === '/map' && user.shop_id && (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 md:gap-1.5 text-blue-600 font-semibold text-xs md:text-sm hover:bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl transition-colors active:scale-95 shrink-0 whitespace-nowrap"
              title="ร้านของฉัน"
            >
              <span className="material-symbols-outlined text-base md:text-[18px]">storefront</span>
              <span className="hidden md:inline">ร้านของฉัน</span>
            </button>
          )}
          
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              className="border border-green-500 text-green-500 rounded-full text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 hover:bg-green-50 transition-colors shrink-0 whitespace-nowrap font-semibold"
            >
              เข้าสู่ระบบ
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile button */}
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2.5 focus:outline-none group"
                aria-label="เมนูผู้ใช้"
                aria-expanded={dropdownOpen}
              >
                <span className="hidden md:block text-xs md:text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors truncate max-w-24 md:max-w-32 text-right">
                  {user.display_name || 'ผู้ใช้งาน'}
                </span>

                {/* Avatar Circle */}
                <div className="w-7 md:w-8 h-7 md:h-8 shrink-0 rounded-full bg-green-500 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-green-100 transition-all">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xs md:text-sm font-bold leading-none">{avatarLetter}</span>
                  )}
                </div>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-100 py-1 min-w-32 md:min-w-40 z-50">
                  {/* Email header */}
                  <div className="px-3 md:px-4 py-1.5 md:py-2 border-b border-gray-100">
                    <p className="text-[10px] md:text-xs text-gray-400 truncate">{user.email}</p>
                  </div>

                  {menuItem('favorite', 'ร้านที่ถูกใจ', () => navigate('/favorites'))}
                  {menuItem('settings', 'ตั้งค่าโปรไฟล์', () => navigate('/profile'))}

                  <div className="border-t border-gray-100 my-1" />

                  {menuItem('logout', 'ออกจากระบบ', () => logout(), true)}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
