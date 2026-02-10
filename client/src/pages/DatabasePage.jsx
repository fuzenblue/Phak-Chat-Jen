import { useState, useEffect } from 'react';
import { dbApi } from '../services/api';

function DatabasePage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await dbApi.getAll('contacts');
            setItems(data.data || []);
        } catch (err) {
            setError('ไม่สามารถโหลดข้อมูลได้: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await dbApi.update('contacts', editingId, formData);
                showSuccess('อัปเดตสำเร็จ! ✅');
            } else {
                await dbApi.create('contacts', formData);
                showSuccess('สร้างสำเร็จ! ✅');
            }
            setFormData({ name: '', email: '', message: '' });
            setEditingId(null);
            fetchItems();
        } catch (err) {
            setError('เกิดข้อผิดพลาด: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({ name: item.name, email: item.email, message: item.message });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณต้องการลบรายการนี้ใช่ไหม?')) return;
        try {
            await dbApi.delete('contacts', id);
            showSuccess('ลบสำเร็จ! 🗑️');
            fetchItems();
        } catch (err) {
            setError('ลบไม่สำเร็จ: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    🗄️ PostgreSQL Database
                </h1>
                <p className="text-slate-400 mt-1 text-sm">CRUD operations — Create, Read, Update, Delete</p>
            </div>

            {/* Notifications */}
            {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm animate-fade-in">
                    {success}
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white mb-2">
                            {editingId ? '✏️ แก้ไขรายการ' : '➕ เพิ่มรายการใหม่'}
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">ชื่อ</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                placeholder="กรอกชื่อ"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">อีเมล</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                placeholder="กรอกอีเมล"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">ข้อความ</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                                placeholder="กรอกข้อความ"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20"
                            >
                                {editingId ? '💾 อัปเดต' : '➕ สร้าง'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all"
                                >
                                    ยกเลิก
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Data Table */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">📋 รายการทั้งหมด</h2>
                            <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                                {items.length} รายการ
                            </span>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                กำลังโหลด...
                            </div>
                        ) : items.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                ยังไม่มีข้อมูล — ลองเพิ่มรายการใหม่
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-white/5 transition-colors group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                                                <p className="text-xs text-indigo-400 mt-0.5">{item.email}</p>
                                                {item.message && (
                                                    <p className="text-xs text-slate-400 mt-1 truncate">{item.message}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatabasePage;
