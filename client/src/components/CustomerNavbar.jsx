import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerNavbar({ title, back = false }) {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const user = null; // temporary mock for UI

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-100 shadow-sm h-14 flex items-center justify-between px-4 font-prompt">
      <div className="w-1/3 flex justify-start">
        {back ? (
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-sm font-medium">ย้อนกลับ</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-green-500 text-[20px]">eco</span>
            <span className="font-bold text-green-600 text-sm tracking-tight">ผักชัดเจน</span>
          </div>
        )}
      </div>

      <div className="w-1/3 flex justify-center">
          <h1 className="font-bold text-gray-800 text-sm truncate px-2">
            Phak Chat Jen
          </h1>
      </div>

      <div className="w-1/3 flex justify-end">
        {!user ? (
          <button onClick={() => navigate('/login')} className="border border-green-500 text-green-500 rounded-full text-[11px] font-bold px-3 py-1 hover:bg-green-50 transition-colors">
            เข้าสู่ระบบ
          </button>
        ) : (
          <div className="w-[60px]" /> // Placeholder to maintain center alignment
        )}
      </div>
    </nav>
  );
}
