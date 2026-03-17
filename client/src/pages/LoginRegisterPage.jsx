import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export default function LoginRegisterPage() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ email: '', password: '', phone_number: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    }

    async function handleSubmit(e) {
        async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // mock delay จำลอง network
        await new Promise(res => setTimeout(res, 800));

        // mock user
        const mockUser = { id: 'u-001', email: form.email, role: 'merchant' };
        const mockToken = 'mock-token-123';

        login(mockUser, mockToken);
        navigate('/dashboard');

        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">

                {/* Logo / Title */}
                <h1 className="text-2xl font-bold text-green-600 text-center mb-1">
                    Phak-Chat-Jen
                </h1>
                <p className="text-gray-400 text-sm text-center mb-6">
                    {mode === 'login' ? 'Login' : 'Register'}
                </p>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />

                    <input type="password" name="password" placeholder="Password (at least 8 characters)" value={form.password} onChange={handleChange} required minLength={8} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />

                    {mode === 'register' && (
                        <input type="tel" name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold rounded-xl py-3 text-sm transition-colors">
                        {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>

                {/* Toggle mode */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    {mode === 'login' ? 'No account?' : 'Already have an account?'}
                    {' '}
                    <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-green-500 font-medium hover:underline">
                        {mode === 'login' ? 'Register' : 'Login'}
                    </button>
                </p>

            </div>
        </div>
    );
}