import { useEffect, useState } from 'react';
import MerchantNavbar from '../components/MerchantNavbar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Helpers
function relativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'เมื่อกี้';
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ชั่วโมงที่แล้ว`;
  return `${Math.floor(diffHr / 24)} วันที่แล้ว`;
}

function FreshnessBadge({ label, score }) {
  const color =
    score >= 75
      ? 'bg-green-100 text-green-600'
      : score >= 50
      ? 'bg-yellow-100 text-yellow-600'
      : 'bg-red-100 text-red-500';
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { label: 'รออนุมัติ',        cls: 'bg-yellow-100 text-yellow-600' },
    executed: { label: 'ดำเนินการแล้ว',    cls: 'bg-green-100  text-green-600'  },
    rejected: { label: 'ปฏิเสธ',           cls: 'bg-gray-100   text-gray-400'   },
  };
  const { label, cls } = map[status] ?? map.rejected;
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${cls}`}>
      {label}
    </span>
  );
}

// Tab config
const TABS = [
  { key: 'all',      label: 'ทั้งหมด' },
  { key: 'pending',  label: 'รออนุมัติ' },
  { key: 'done',     label: 'ดำเนินการแล้ว' },
];

function filterActions(actions, tab) {
  if (tab === 'pending') return actions.filter((a) => a.status === 'pending');
  if (tab === 'done')    return actions.filter((a) => a.status === 'executed' || a.status === 'rejected');
  return actions;
}

// Action Card
function ActionCard({ action, onApprove, onReject }) {
  const { post_snapshot: snap, action_type, old_value, new_value, reason, status, created_at } = action;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 border border-gray-50">

      {/* Row 1: image + name + freshness + status badge */}
      <div className="flex items-start gap-3">
        <img
          src={snap.image_url}
          alt={snap.veg_type}
          className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/e8f5e9/4caf50?text=🌿'; }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-800 text-sm leading-tight">{snap.veg_type}</p>
            <FreshnessBadge label={snap.freshness_label} score={snap.freshness_score} />
          </div>

          {/* Action detail */}
          <div className="mt-1.5">
            {action_type === 'price_update' ? (
              <div className="flex items-center gap-1.5 text-sm">
                <span className="line-through text-gray-400 font-funnel">฿{old_value.price}</span>
                <span className="text-gray-300">→</span>
                <span className="text-green-600 font-bold font-funnel">฿{new_value.price}</span>
                <span className="text-[10px] text-gray-300 font-medium">
                  (-{Math.round(((old_value.price - new_value.price) / old_value.price) * 100)}%)
                </span>
              </div>
            ) : (
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-500">
                ปิดรายการ
              </span>
            )}
          </div>
        </div>

        {/* Status badge top-right */}
        <StatusBadge status={status} />
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-500 italic leading-relaxed border-l-2 border-gray-100 pl-3">
        "{reason}"
      </p>

      {/* Timestamp */}
      <p className="text-xs text-gray-300">{relativeTime(created_at)}</p>

      {/* Approve / Reject buttons (pending only) */}
      {status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onApprove(action.id)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 active:scale-[0.97] text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-green-100"
          >
            <span className="text-base leading-none">✓</span>
            อนุมัติ
          </button>
          <button
            onClick={() => onReject(action.id)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 active:scale-[0.97] text-gray-500 text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            <span className="text-base leading-none">✕</span>
            ปฏิเสธ
          </button>
        </div>
      )}
    </div>
  );
}

// Main Page
export default function AgentActivityPage() {
  const { user, logout } = useAuth();

  const [actions, setActions] = useState([]);
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await api.get('auth/me');
        const sid = meRes.data.data.shop_id;
        setShopId(sid);
        if (sid) {
          const res = await api.get(`agent/actions/${sid}`);
          setActions(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`agent/actions/${id}`, { status: 'executed' });
      setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'executed' } : a));
    } catch (err) {
      alert('ไม่สามารถอนุมัติได้');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`agent/actions/${id}`, { status: 'rejected' });
      setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    } catch (err) {
      alert('ไม่สามารถปฏิเสธได้');
    }
  };

  const filtered = filterActions(actions, activeTab);
  const pendingCount = actions.filter((a) => a.status === 'pending').length;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-200 border-t-green-500 rounded-full animate-spin" />
    </div>
  );

  if (!shopId) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">ยังไม่มีร้านค้า</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      {/* Navbar */}
      <MerchantNavbar
        shopName="Activity Agent"
        ownerName={user?.email || ''}
        onLogout={logout}
      />

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10">
        <div className="max-w-2xl mx-auto px-4 flex">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative py-3.5 px-4 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {/* Badge count for pending tab */}
                {tab.key === 'pending' && pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-yellow-400 text-white leading-none">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-3">

        {/* Summary bar (all tab only) */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-3 gap-2 mb-1">
            {[
              { label: 'รออนุมัติ',     value: actions.filter(a => a.status === 'pending').length,  cls: 'text-yellow-500' },
              { label: 'ดำเนินการแล้ว', value: actions.filter(a => a.status === 'executed').length, cls: 'text-green-500'  },
              { label: 'ปฏิเสธ',        value: actions.filter(a => a.status === 'rejected').length, cls: 'text-gray-400'   },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-50 shadow-sm px-3 py-3 text-center">
                <p className={`text-xl font-black ${s.cls}`}>{s.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-300">
            <span className="material-symbols-outlined text-[48px]">smart_toy</span>
            <p className="text-sm font-medium text-gray-400">ไม่มีรายการในหมวดนี้</p>
          </div>
        )}

        {/* Action cards */}
        {filtered.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
}
