import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomerNavbar from '../components/CustomerNavbar';
import api from '../services/api';

// Simple toast component
function Toast({ message, type = 'success' }) {
  if (!message) return null;
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-white text-sm font-medium shadow-lg transition-all ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`}
    >
      {message}
    </div>
  );
}

// Section card wrapper
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-50">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// Text input field
function Field({ label, icon, type = 'text', value, onChange, placeholder, readOnly = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border text-sm ${
        readOnly
          ? 'bg-gray-50 border-gray-100 text-gray-400'
          : 'bg-white border-gray-200 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all'
      }`}>
        {icon && (
          <span className={`material-symbols-outlined text-[18px] shrink-0 ${readOnly ? 'text-gray-300' : 'text-gray-400'}`}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-300 font-prompt"
        />
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user, login, loading, updateUser } = useAuth();

  // Auth guard
  useEffect(() => {
    if (!loading && user === null) navigate('/login', { replace: true });
  }, [user, loading, navigate]);

  // Profile state
  const [profile, setProfile] = useState({
    display_name: '',
    avatar_url: '',
  });
  const [savedDisplayName, setSavedDisplayName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Hidden file input ref for avatar upload
  const fileInputRef = useRef(null);

  // Password state
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  // Fetch full profile on mount
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await api.get('auth/me');
        const data = res.data.data;
        setProfile({
          display_name: data.display_name || '',
          avatar_url: data.avatar_url || '',
        });
        setSavedDisplayName(data.display_name || '');
      } catch (err) {
        console.error('Fetch profile failed:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Save personal info
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.patch('auth/profile', {
        display_name: profile.display_name || undefined,
        avatar_url: profile.avatar_url || undefined,
      });
      setSavedDisplayName(profile.display_name || '');
      updateUser({ display_name: profile.display_name, avatar_url: profile.avatar_url });
      showToast('บันทึกข้อมูลสำเร็จ');
    } catch (err) {
      showToast(err?.response?.data?.message || 'บันทึกไม่สำเร็จ', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Upload avatar image to Cloudinary via /api/upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size guard (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('รูปต้องไม่เกิน 5MB', 'error');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      // Save URL to profile state and immediately persist
      setProfile(p => ({ ...p, avatar_url: data.url }));
      await api.patch('auth/profile', { avatar_url: data.url });
      updateUser({ avatar_url: data.url });
      showToast('อัปโหลดรูปโพรไฟล์สำเร็จ');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      showToast('อัปโหลดไม่สำเร็จ กรุณาลองใหม่', 'error');
    } finally {
      setUploadingAvatar(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!pwForm.current_password || !pwForm.new_password || !pwForm.confirm_password) {
      showToast('กรุณากรอกข้อมูลให้ครบ', 'error');
      return;
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      showToast('รหัสผ่านใหม่ไม่ตรงกัน', 'error');
      return;
    }
    if (pwForm.new_password.length < 6) {
      showToast('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await api.patch('auth/password', {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
      showToast('เปลี่ยนรหัสผ่านสำเร็จ');
    } catch (err) {
      showToast(err?.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return null;
  if (!user) return null;

  // Avatar letter fallback
  const avatarLetter = (savedDisplayName || user?.email || '?')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 font-prompt pb-12 pt-14">
      <CustomerNavbar title="ตั้งค่าโปรไฟล์" back={true} />

      <main className="max-w-lg mx-auto w-full px-4 py-6 space-y-5">

        {/* Avatar header — click to upload */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative group">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            {/* Avatar circle / image */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full overflow-hidden shadow-md ring-4 ring-white focus:outline-none focus:ring-green-300 transition-all"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                />
              ) : (
                <div className="w-full h-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold leading-none">{avatarLetter}</span>
                </div>
              )}

              {/* Upload overlay on hover / while uploading */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity ${
                uploadingAvatar ? 'bg-black/50' : 'bg-black/0 group-hover:bg-black/40'
              }`}>
                {uploadingAvatar ? (
                  <span className="material-symbols-outlined animate-spin text-white text-[24px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-white text-[22px] opacity-0 group-hover:opacity-100 transition-opacity">photo_camera</span>
                )}
              </div>
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-gray-400 mt-1">แตะรูปเพื่อเปลี่ยนโปรไฟล์</p>
            <p className="font-bold text-gray-800">{savedDisplayName || 'ผู้ใช้งาน'}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-green-100 text-green-600 font-semibold">
              <span className="material-symbols-outlined text-[12px]">{user.role === 'customer' ? 'person' : 'storefront'}</span>
              {user.role === 'customer' ? 'ผู้ซื้อ' : 'ผู้ขาย'}
            </span>
          </div>
        </div>

        {/* Personal Info */}
        {loadingProfile ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-green-400 text-[32px]">progress_activity</span>
          </div>
        ) : (
          <>
            <Section title="ข้อมูลส่วนตัว">
              <Field
                label="อีเมล (ไม่สามารถเปลี่ยนได้)"
                icon="mail"
                value={user.email}
                readOnly
              />
              <Field
                label="ชื่อที่แสดง"
                icon="badge"
                value={profile.display_name}
                onChange={(e) => setProfile(p => ({ ...p, display_name: e.target.value }))}
                placeholder="เช่น คุณสมชาย"
              />

              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 active:scale-[0.98] text-white font-bold rounded-xl py-3 transition-all flex items-center justify-center gap-2"
              >
                {savingProfile ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">save</span>
                )}
                {savingProfile ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </Section>

            {/* Change Password */}
            <Section title="เปลี่ยนรหัสผ่าน">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400">กรอกเฉพาะเมื่อต้องการเปลี่ยนรหัสผ่าน</p>
                <button
                  onClick={() => setShowPasswords(p => !p)}
                  className="text-xs text-green-500 font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">{showPasswords ? 'visibility_off' : 'visibility'}</span>
                  {showPasswords ? 'ซ่อน' : 'แสดง'}
                </button>
              </div>

              <Field
                label="รหัสผ่านปัจจุบัน"
                icon="lock"
                type={showPasswords ? 'text' : 'password'}
                value={pwForm.current_password}
                onChange={(e) => setPwForm(p => ({ ...p, current_password: e.target.value }))}
                placeholder="รหัสผ่านเดิม"
              />
              <Field
                label="รหัสผ่านใหม่"
                icon="lock_open"
                type={showPasswords ? 'text' : 'password'}
                value={pwForm.new_password}
                onChange={(e) => setPwForm(p => ({ ...p, new_password: e.target.value }))}
                placeholder="อย่างน้อย 6 ตัวอักษร"
              />
              <Field
                label="ยืนยันรหัสผ่านใหม่"
                icon="lock_open"
                type={showPasswords ? 'text' : 'password'}
                value={pwForm.confirm_password}
                onChange={(e) => setPwForm(p => ({ ...p, confirm_password: e.target.value }))}
                placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
              />

              {/* Password match indicator */}
              {pwForm.new_password && pwForm.confirm_password && (
                <p className={`text-xs flex items-center gap-1 -mt-1 ${
                  pwForm.new_password === pwForm.confirm_password ? 'text-green-500' : 'text-red-400'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {pwForm.new_password === pwForm.confirm_password ? 'check_circle' : 'cancel'}
                  </span>
                  {pwForm.new_password === pwForm.confirm_password ? 'รหัสผ่านตรงกัน' : 'รหัสผ่านไม่ตรงกัน'}
                </p>
              )}

              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 active:scale-[0.98] text-white font-bold rounded-xl py-3 transition-all flex items-center justify-center gap-2"
              >
                {savingPassword ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">key</span>
                )}
                {savingPassword ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
              </button>
            </Section>

            {/* Account Info */}
            <Section title="ข้อมูลบัญชี">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">manage_accounts</span>
                  ประเภทบัญชี
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {user.role === 'customer' ? 'ผู้ซื้อ' : 'ผู้ขาย'}
                </span>
              </div>
            </Section>
          </>
        )}
      </main>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
