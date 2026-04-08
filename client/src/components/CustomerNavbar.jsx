import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerNavbar({ title, back = false }) {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const user = null; // temporary mock for UI

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-100 shadow-sm h-14 font-prompt">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="w-1/3 flex justify-start">
          {back ? (
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-sm font-medium hidden sm:inline">ย้อนกลับ</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0 overflow-hidden">
              <span className="material-symbols-outlined text-green-500 text-[20px] shrink-0">eco</span>
              <span className="font-bold text-green-600 text-[13px] sm:text-sm tracking-tight truncate">ผักชัดเจน</span>
            </div>
          )}
        </button>

        <div className="w-1/3 flex justify-center overflow-hidden px-2">
            <h1 className="font-bold text-gray-800 text-sm truncate whitespace-nowrap">
              {title || "Phak Chat Jen"}
            </h1>
        </div>


        <div className="w-1/3 flex justify-end">
          {!user ? (
            <button onClick={() => navigate('/login')} className="bg-green-500 sm:bg-transparent border border-green-500 text-white sm:text-green-500 rounded-full text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 hover:bg-green-50 transition-colors shrink-0 whitespace-nowrap">
              เข้าสู่ระบบ
            </button>
          ) : (
            <div className="w-4" /> 
          )}
        </div>
      </div>
    </nav>
  );
}
