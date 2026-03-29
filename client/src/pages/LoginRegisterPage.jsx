import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios'; 

export default function LoginRegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [email, setEmail] = useState(''); // 2. เปลี่ยนจาก phone เป็น email
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // เพิ่มตัวแปรเก็บ error

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log("--- [1] เริ่มการ Login ---");
        console.log("Data to send:", { email, password: "******" });
        
        try {
            // 3. เชื่อมต่อกับ Backend จริงๆ
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: email, // ส่ง email ไป
                password: password
            });
            console.log("--- [2] Server ตอบกลับมาแล้ว! ---");
            console.log("Status Code:", response.status);
            console.log("Response Data:", response.data);
            if (response.status === 200) {
                // เก็บข้อมูลลง context
                login(response.data.user, response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("--- [X] เกิดข้อผิดพลาด! ---");
            console.log("Error Status:", err.response?.status);
            console.log("Error Message:", err.response?.data?.message);
            setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        } finally {
            setLoading(false);
        }
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
                    <p className="text-gray-500 mt-1">เข้าสู่ระบบสำหรับร้านค้า</p>
                </div>

                <div className="bg-white w-full rounded-3xl shadow-xl shadow-green-900/5 p-8 border border-white">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-2">
                            {/* 4. เปลี่ยน Label เป็น อีเมล */}
                            <label className="text-sm font-semibold text-gray-700 ml-1">อีเมล</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 material-symbols-outlined text-[20px]">
                                    mail {/* เปลี่ยนไอคอนเป็นรูปซองจดหมาย */}
                                </span>
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
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 material-symbols-outlined text-[20px]">
                                    lock
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-12 py-4 text-gray-800 focus:ring-2 focus:ring-green-500 transition-all outline-none font-sans"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? "visibility" : "visibility_off"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-2xl py-4 shadow-lg shadow-green-200 transition-all flex items-center justify-center">
                            {loading ? (
                                <span className="animate-spin material-symbols-outlined">progress_activity</span>
                            ) : "เข้าสู่ระบบ"}
                        </button>
                    </form>
                </div>

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
            </div>  
        </div>
    );
}