import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CATEGORIES = [
  { id: 1, emoji: "🥬", name: "ผักกาด" }, { id: 2, emoji: "🍅", name: "มะเขือเทศ" },
  { id: 3, emoji: "🥦", name: "คะน้า" }, { id: 4, emoji: "🥕", name: "แครอท" },
  { id: 5, emoji: "🥬", name: "กะหล่ำปลี" }, { id: 6, emoji: "🌶️", name: "พริก" },
  { id: 7, emoji: "🥒", name: "แตงกวา" }, { id: 8, emoji: "🌽", name: "ข้าวโพด" },
  { id: 9, emoji: "🍆", name: "มะเขือ" }, { id: 10, emoji: "🎃", name: "ฟักทอง" },
  { id: 18, emoji: "🥬", name: "ใบกระเพรา" }, { id: 19, emoji: "🍈", name: "มะละกอ" },
];

const UNITS = ["บาท/กก.", "บาท/กำ", "บาท/แพ็ก", "บาท/ลูก", "บาท/มัด"];

// --- 1. เลือกประเภท (Desktop Friendly) ---
const Step1 = ({ onNext, selected, setSelected }) => {
  const [search, setSearch] = useState("");
  const filtered = CATEGORIES.filter(c => c.name.includes(search));

  return (
    <div className="p-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <label className="text-lg font-bold text-gray-700 block mb-4">ค้นหาประเภทสินค้า</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="พิมพ์ชื่อผัก เช่น คะน้า, กะหล่ำ..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-2xl transition-all outline-none text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-24">
          {filtered.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                selected === cat.id ? "border-green-500 bg-green-50 shadow-md" : "border-gray-100 bg-white hover:border-green-200"
              }`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="font-bold text-gray-700">{cat.name}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
            <button onClick={onNext} className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2">
              ถัดไป <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. อัปโหลดและวิเคราะห์ ---
const Step2 = ({ onAnalyze, selectedCat, images, setImages, basePrice, setBasePrice, unit, setUnit, desc, setDesc }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFiles = (files) => {
    const newImgs = Array.from(files).map(f => ({ id: Math.random(), url: URL.createObjectURL(f), file: f }));
    setImages(newImgs.slice(0, 1)); // เน้นรูปหลัก 1 รูปสำหรับการสแกน
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', images[0].file);
      formData.append('veg_type', CATEGORIES.find(c => c.id === selectedCat).name);
      formData.append('original_price', basePrice);
      formData.append('description', desc);

      const response = await api.post('v1/scans', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onAnalyze({ ...response.data.data, basePrice, unit, desc });
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <label className="font-bold text-gray-700 block">รูปถ่ายสินค้า</label>
          <div 
            onClick={() => !loading && fileRef.current.click()}
            className="aspect-square border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50 hover:bg-green-50 hover:border-green-200 transition-all cursor-pointer overflow-hidden"
          >
            {images.length > 0 ? (
              <img src={images[0].url} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-gray-300">add_a_photo</span>
                <p className="text-gray-400 mt-2">คลิกเพื่ออัปโหลดรูป</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
               <label className="font-bold text-gray-700 block mb-2">ราคาตั้งต้น (ต่อหน่วย)</label>
               <input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" />
            </div>
            <div className="col-span-2 md:col-span-1">
               <label className="font-bold text-gray-700 block mb-2">หน่วยสินค้า</label>
               <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none">
                 {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
               </select>
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-2">บันทึกเพิ่มเติม</label>
            <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น ผักสดจากสวนเช้านี้..." />
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={!images.length || !basePrice || loading}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 disabled:bg-gray-200"
          >
            {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ความสดด้วย AI"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. สรุปผลและใส่จำนวน (Desktop Split UI) ---
const Step3 = ({ scanResult, onConfirm }) => {
  const [finalPrice, setFinalPrice] = useState(scanResult?.recommended_price || scanResult?.basePrice || "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const isOverPrice = Number(finalPrice) > Number(scanResult?.recommended_price);

  const handlePost = async () => {
    setLoading(true);
    try {
      const payload = {
        scan_id: scanResult.id || scanResult.scan_id,
        price: parseFloat(finalPrice),
        original_price: parseFloat(scanResult.basePrice),
        quantity: parseInt(quantity), // ✅ ส่งค่า quantity เป็นตัวเลขลง DB
        expired_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };
      await api.post('v1/posts', payload);
      onConfirm();
    } catch (err) { alert("ล้มเหลว"); } finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-50">
           <img src={scanResult.image_url} className="w-full aspect-square object-cover" alt="result" />
           <div className="p-6 bg-green-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-green-800">คะแนนความสดจาก AI</span>
                <span className="text-2xl font-black text-green-600">{scanResult.freshness_score}%</span>
              </div>
              <p className="text-sm text-green-700">{scanResult.ai_summary}</p>
           </div>
        </div>

        <div className="space-y-8">
           <h2 className="text-3xl font-black text-gray-800">สรุปการลงขาย</h2>
           <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-600">ราคาขายจริง (฿)</label>
                <input type="number" value={finalPrice} onChange={e => setFinalPrice(e.target.value)} 
                  className={`text-3xl font-bold p-6 rounded-3xl border-4 outline-none ${isOverPrice ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-green-100 bg-green-50 text-green-600'}`} />
                {isOverPrice && <p className="text-orange-500 text-sm font-bold">⚠️ สูงกว่าราคาแนะนำ (฿{scanResult.recommended_price})</p>}
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-600">จำนวนสินค้าในสต็อก</label>
                <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} 
                  className="text-3xl font-bold p-6 rounded-3xl bg-gray-50 border-4 border-transparent focus:border-black outline-none" />
              </div>
           </div>

           <button onClick={handlePost} disabled={loading} className="w-full py-6 bg-green-500 text-white text-xl font-black rounded-[2rem] shadow-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-3">
              {loading ? "กำลังบันทึก..." : <><span className="material-symbols-outlined">check_circle</span> ยืนยันการลงขาย</>}
           </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. สำเร็จ ---
const Step4 = ({ onReset }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-scaleIn">
      <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-6xl text-green-600">task_alt</span>
      </div>
      <h2 className="text-4xl font-black text-gray-800 mb-4">ลงขายสำเร็จ!</h2>
      <p className="text-gray-400 mb-12 text-lg">ข้อมูลสินค้าถูกส่งไปยังหน้าร้านของคุณแล้ว</p>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md px-6">
        <button onClick={() => navigate('/dashboard')} className="flex-1 py-5 bg-black text-white font-bold rounded-2xl">ไปหน้าแดชบอร์ด</button>
        <button onClick={onReset} className="flex-1 py-5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200">เพิ่มสินค้าเพิ่ม</button>
      </div>
    </div>
  );
};

// --- Main App ---
export default function AddProduct() {
  const [step, setStep] = useState(1);
  const [selectedCat, setSelectedCat] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [images, setImages] = useState([]);
  const [basePrice, setBasePrice] = useState("");
  const [unit, setUnit] = useState(UNITS[0]);
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  const handleReset = () => { setStep(1); setSelectedCat(null); setImages([]); setBasePrice(""); setScanResult(null); };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 px-4 font-['Sarabun']">
      <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl min-h-[80vh] flex flex-col overflow-hidden border border-gray-50">
        {step < 4 && (
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
               <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all">
                 <span className="material-symbols-outlined">arrow_back_ios_new</span>
               </button>
               <div>
                 <h1 className="text-3xl font-black text-gray-900 leading-none">เพิ่มสินค้า</h1>
                 <p className="text-gray-400 mt-2 font-medium">ขั้นตอนที่ {step} จาก 3</p>
               </div>
            </div>
            <div className="flex gap-2">
               {[1, 2, 3].map(i => <div key={i} className={`h-3 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-green-500' : 'w-3 bg-gray-200'}`} />)}
            </div>
          </div>
        )}
        
        <div className="flex-1 relative overflow-y-auto">
          {step === 1 && <Step1 onNext={() => setStep(2)} selected={selectedCat} setSelected={setSelectedCat} />}
          {step === 2 && <Step2 onAnalyze={r => { setScanResult(r); setStep(3); }} selectedCat={selectedCat} images={images} setImages={setImages} basePrice={basePrice} setBasePrice={setBasePrice} unit={unit} setUnit={setUnit} desc={desc} setDesc={setDesc} />}
          {step === 3 && <Step3 scanResult={scanResult} onConfirm={() => setStep(4)} />}
          {step === 4 && <Step4 onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
}