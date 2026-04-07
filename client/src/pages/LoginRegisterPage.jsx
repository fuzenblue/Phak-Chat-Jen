import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api'; 

export default function LoginRegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [tab, setTab] = useState('login'); // 'login' | 'register'

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDemo, setShowDemo] = useState(false);

    // Register state
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [showRegPassword, setShowRegPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('auth/login', { email, password });
            
            if (response.data.token) {
                login(response.data.user, response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (regPassword !== regConfirm) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await api.post('auth/register', {
                email: regEmail,
                password: regPassword,
                role: 'merchant',
            });

            if (response.data.token) {
                login(response.data.user, response.data.token);
                navigate('/dashboard/setup');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ โปรดลองอีกครั้ง');
        } finally {
            setLoading(false);
        }
    }

    function switchTab(t) {
        setTab(t);
        setError('');
    }

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center relative font-prompt py-10">
            
            <button onClick={() => navigate('/map')} className="fixed top-6 left-6 text-gray-500 hover:text-green-600 flex items-center gap-1 text-sm font-medium transition-colors z-30 px-4 md:px-16">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                กลับหน้าแผนที่
            </button>

            <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                        <span className="material-symbols-outlined text-white text-[40px] leading-none">eco</span>
                    </div>
                    <h1 className="text-3xl font-bold text-green-700">ผักชัดเจน</h1>
                    <p className="text-gray-500 mt-1">ระบบสำหรับร้านค้า</p>
                </div>

                {/* Tab switcher */}
                <div className="bg-gray-100 rounded-2xl p-1 flex gap-1 w-full mb-4">
                    <button
                        onClick={() => switchTab('login')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        เข้าสู่ระบบ
                    </button>
                    <button
                        onClick={() => switchTab('register')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        สมัครสมาชิก
                    </button>
                </div>

                <div className="bg-white w-full rounded-3xl shadow-xl shadow-green-900/5 p-8 border border-white">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* ─── Login Form ─── */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">อีเมล</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 material-symbols-outlined text-[20px]">mail</span>
                                    <input 
                                        type="email" 
                                        placeholder="example@mail.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-gray-800 focus:ring-2 focus:ring-green-500 transition-all outline-none font-sans"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">รหัสผ่าน</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 material-symbols-outlined text-[20px]">lock</span>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-12 py-4 text-gray-800 focus:ring-2 focus:ring-green-500 transition-all outline-none font-sans"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility" : "visibility_off"}</span>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-2xl py-4 shadow-lg shadow-green-200 transition-all flex items-center justify-center">
                                {loading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : "เข้าสู่ระบบ"}
                            </button>
                        </form>
                    )}

                    {/* ─── Register Form ─── */}
                    {tab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">อีเมล</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 material-symbols-outlined text-[20px]">mail</span>
                                    <input 
                                        type="email" 
                                        placeholder="example@mail.com"
                                        value={regEmail} 
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required 
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-gray-800 focus:ring-2 focus:ring-green-500 transition-all outline-none font-sans"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">รหัสผ่าน</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 material-symbols-outlined text-[20px]">lock</span>
                                    <input 
                                        type={showRegPassword ? "text" : "password"} 
                                        placeholder="อย่างน้อย 8 ตัวอักษร"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-12 py-4 text-gray-800 focus:ring-2 focus:ring-green-500 transition-all outline-none font-sans"
                                    />
                                    <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">{showRegPassword ? "visibility" : "visibility_off"}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">ยืนยันรหัสผ่าน</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 material-symbols-outlined text-[20px]">lock_reset</span>
                                    <input 
                                        type={showRegPassword ? "text" : "password"} 
                                        placeholder="••••••••"
                                        value={regConfirm}
                                        onChange={(e) => setRegConfirm(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-gray-800 focus:ring-2 focus:ring-green-500 transition-all outline-none font-sans"
                                    />
                                </div>
                            </div>

                    

                            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-2xl py-4 shadow-lg shadow-green-200 transition-all flex items-center justify-center">
                                {loading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : "สมัครสมาชิกและตั้งค่าร้าน"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Demo accounts (login tab only) */}
                {tab === 'login' && (
                    <div className="mt-8 w-full">
                        <button onClick={() => setShowDemo(!showDemo)} className="w-full flex items-center justify-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors">
                            ดูบัญชีทดสอบ (Demo) 
                            <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${showDemo ? 'rotate-180' : ''}`}>
                                keyboard_arrow_down
                            </span>
                        </button>
                        
                        {showDemo && (
                            <div className="mt-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-green-200 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center py-2 border-b border-green-100">
                                    <span className="text-gray-500">อีเมล:</span>
                                    <span className="font-sans font-bold text-gray-700">test@gmail.com</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500">รหัสผ่าน:</span>
                                    <span className="font-sans font-bold text-gray-700">password123</span>
                                </div>
                                <button onClick={() => {
                                        setEmail('test@gmail.com');
                                        setPassword('password123');
                                    }} className="w-full mt-3 py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors">
                                    ใช้ชุดข้อมูลนี้
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>  
        </div>
    );
}