import { useState, useEffect } from 'react';
import MerchantNavbar from '../components/MerchantNavbar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// ── Reusable Toggle ────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-green-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ── Reusable Card ──────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function AgentSettingsPage() {
  const { user, logout } = useAuth();

  const [policy, setPolicy] = useState({
    active: false,
    max_discount: 30,
    auto_approve: false,
  });

  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shopId, setShopId] = useState(null);

  // Fetch shop and policy on mount
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const shopRes = await api.get('shops/my-shop');
        const sid = shopRes.data.data.id;
        setShopId(sid);

        const policyRes = await api.get(`agent/policy/${sid}`);
        setPolicy(policyRes.data.data);
      } catch (err) {
        console.error('Failed to fetch policy:', err);
        setToastMessage('ไม่สามารถโหลดข้อมูลได้');
        setToastType('error');
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  // Show toast with auto-hide
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  // ── handlers ──────────────────────────────────────────────────────
  const handleToggleActive = (val) => {
    setPolicy((prev) => ({ ...prev, active: val }));
  };

  const handleDiscount = (delta) => {
    setPolicy((prev) => ({
      ...prev,
      max_discount: Math.min(80, Math.max(5, prev.max_discount + delta)),
    }));
  };

  const handleApproval = (auto_approve) => {
    setPolicy((prev) => ({ ...prev, auto_approve }));
  };

  const handleSave = async () => {
    if (!shopId) return;
    
    setSaving(true);
    try {
      await api.post(`agent/policy/${shopId}`, policy);
      showToast('บันทึกการตั้งค่า Agent สำเร็จ!', 'success');
    } catch (err) {
      console.error('Failed to save policy:', err);
      const errorMsg = err.response?.data?.error?.message || 'ไม่สามารถบันทึกข้อมูลได้';
      showToast(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      {/* Navbar */}
      <MerchantNavbar
        shopName="ตั้งค่า Agent"
        ownerName={user?.email || ''}
        onLogout={logout}
      />

      {/* Toast */}
      <div
        className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className={`flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-lg ${
          toastType === 'success' ? 'bg-green-500 shadow-green-200' : 'bg-red-500 shadow-red-200'
        }`}>
          <span className="material-symbols-outlined text-[18px]">
            {toastType === 'success' ? 'check_circle' : 'error'}
          </span>
          {toastMessage}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <>


        {/* ── Card 1: Toggle Agent ───────────────────────────────── */}
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 leading-snug">
                AI Agent ปรับราคาอัตโนมัติ
              </p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Agent จะวิเคราะห์สินค้าทุก 1 ชั่วโมงและปรับราคาให้อัตโนมัติ
              </p>
            </div>
            <Toggle checked={policy.active} onChange={handleToggleActive} />
          </div>

          {/* Status pill */}
          <div
            className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
              policy.active
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                policy.active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`}
            />
            {policy.active ? 'กำลังทำงาน' : 'ปิดอยู่'}
          </div>
        </Card>

        {/* ── Card 2: Max Discount (แสดงเฉพาะเมื่อ active) ─────── */}
        {policy.active && (
          <Card>
            <p className="font-bold text-gray-800 mb-4">ลดราคาได้สูงสุด</p>
            <div className="flex items-center justify-center gap-5">
              {/* − */}
              <button
                onClick={() => handleDiscount(-5)}
                disabled={policy.max_discount <= 5}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xl font-bold transition-all active:scale-95 ${
                  policy.max_discount <= 5
                    ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50 shadow-sm'
                }`}
              >
                −
              </button>

              {/* Value */}
              <div className="text-center w-28">
                <span className="text-5xl font-bold text-green-500 tabular-nums">
                  {policy.max_discount}
                </span>
                <span className="text-2xl font-bold text-green-400">%</span>
                <p className="text-xs text-gray-400 mt-1">จากราคาตั้งต้น</p>
              </div>

              {/* + */}
              <button
                onClick={() => handleDiscount(5)}
                disabled={policy.max_discount >= 80}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xl font-bold transition-all active:scale-95 ${
                  policy.max_discount >= 80
                    ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-green-400 text-white bg-green-500 hover:bg-green-600 shadow-sm shadow-green-100'
                }`}
              >
                +
              </button>
            </div>

            {/* Track bar */}
            <div className="mt-5 mx-auto max-w-xs">
              <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-200"
                  style={{ width: `${((policy.max_discount - 5) / 75) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-300 mt-1 font-funnel">
                <span>5%</span>
                <span>80%</span>
              </div>
            </div>
          </Card>
        )}

        {/* ── Card 3: Approval Mode (แสดงเฉพาะเมื่อ active) ─────── */}
        {policy.active && (
          <Card>
            <p className="font-bold text-gray-800 mb-3">การอนุมัติ</p>
            <div className="space-y-3">

              {/* Option A — ต้องอนุมัติทุกครั้ง */}
              <button
                onClick={() => handleApproval(false)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
                  !policy.auto_approve
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      !policy.auto_approve ? 'border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {!policy.auto_approve && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${!policy.auto_approve ? 'text-green-700' : 'text-gray-700'}`}>
                      ต้องอนุมัติทุกครั้ง
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Agent จะ notify ก่อน แล้วรอ approve จากคุณ
                    </p>
                  </div>
                </div>
              </button>

              {/* Option B — อนุมัติอัตโนมัติ */}
              <button
                onClick={() => handleApproval(true)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
                  policy.auto_approve
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      policy.auto_approve ? 'border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {policy.auto_approve && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${policy.auto_approve ? 'text-green-700' : 'text-gray-700'}`}>
                      อนุมัติอัตโนมัติ
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Agent ทำได้เลยถ้าอยู่ใน policy ที่กำหนด
                    </p>
                  </div>
                </div>
              </button>

            </div>
          </Card>
        )}

        {/* ── Save Button ────────────────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm ${
            saving 
              ? 'bg-gray-300 cursor-not-allowed shadow-gray-100' 
              : 'bg-green-500 hover:bg-green-600 active:scale-[0.98] shadow-green-100'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {saving ? 'hourglass_empty' : 'save'}
          </span>
          {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
        </button>
          </>
        )}

      </div>
    </div>
  );
}
