import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MerchantNavbar from "../components/MerchantNavbar";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { CATEGORIES, UNITS } from "../constants";


// --- 1. เลือกประเภท ---
const Step1 = ({ onNext, selected, setSelected }) => {
  const [search, setSearch] = useState("");
  const filtered = CATEGORIES.filter(c => c.name.includes(search));

  return (
    <div className="p-5 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <label className="text-sm font-bold text-gray-700 block mb-2">ค้นหาประเภทสินค้า</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="พิมพ์ชื่อผัก เช่น คะน้า, กะหล่ำ..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {filtered.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                selected === cat.id ? "border-green-500 bg-green-50 shadow-md" : "border-gray-100 bg-white hover:border-green-200"
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="font-bold text-gray-700 text-xs">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onNext}
            disabled={!selected}
            className={`px-22 py-2.5 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm ${
              selected
                ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            ถัดไป <span className="material-symbols-outlined">arrow_right_alt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. อัปโหลดและวิเคราะห์ ---
const Step2 = ({ onAnalyze, selectedCat, images, setImages, basePrice, setBasePrice, unit, setUnit, desc, setDesc }) => {
  const [loading, setLoading] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [category, setCategory] = useState(selectedCat);
  const fileRef = useRef();

  const handleGenerateDescription = async () => {
    if (!images.length) {
      alert("กรุณาเลือกรูปภาพก่อน");
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const formData = new FormData();
      formData.append('image', images[0].file);
      formData.append('veg_type', CATEGORIES.find(c => c.id === category).name);
      formData.append('original_price', basePrice);

      const response = await api.post('scans/descriptions/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Add 1 second delay before setting description
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDesc(response.data.data.description || "");
    } catch (err) {
      // Fallback: generate a simple description template if API fails
      const cat = CATEGORIES.find(c => c.id === category);
      const template = `${cat.emoji} ${cat.name} สดใหม่ คุณภาพดี ราคา ฿${basePrice} ต่อหน่วย`;
      setDesc(template);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleFiles = (files) => {
    const newImgs = Array.from(files).map(f => ({ id: Math.random(), url: URL.createObjectURL(f), file: f }));
    setImages(newImgs.slice(0, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const selectedUnit = unit || 'กก.';
      const formData = new FormData();
      formData.append('image', images[0].file);
      formData.append('veg_type', CATEGORIES.find(c => c.id === category).name);
      formData.append('original_price', basePrice);
      formData.append('description', desc);

      const response = await api.post('scans', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onAnalyze({ ...response.data.data, basePrice, unit: selectedUnit, desc });
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-5 max-w-5xl mx-auto animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="font-bold text-gray-700 block text-sm">รูปถ่ายสินค้า</label>
          <div
            onClick={() => !loading && fileRef.current.click()}
            className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-green-50 hover:border-green-300 transition-all cursor-pointer overflow-hidden"
          >
            {images.length > 0 ? (
              <img src={images[0].url} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <div className="text-center">
                <span className="material-symbols-outlined text-3xl text-gray-300">add_a_photo</span>
                <p className="text-gray-400 mt-1 text-sm">คลิกเพื่ออัปโหลดรูป</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1.5 text-sm">ประเภทสินค้า</label>
            <select value={category} onChange={e => setCategory(Number(e.target.value))} 
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm">
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 md:col-span-1">
              <label className="font-bold text-gray-700 block mb-1.5 text-sm">ราคาตั้งต้น(บาท/หน่วยสินค้า)</label>
              <input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="0.00" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="font-bold text-gray-700 block mb-1.5 text-sm">หน่วยสินค้า</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="font-bold text-gray-700 block mb-1.5 text-sm flex items-center justify-between">
              <span>คำอธิบายสินค้า</span>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDesc || !images.length}
                className="py-1 px-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                {isGeneratingDesc ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin inline-block">hourglass_empty</span>
                    สร้าง...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    สร้างด้วย AI
                  </>
                )}
              </button>
            </div>
            <div className="space-y-1">
              <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value.slice(0, 300))} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="เช่น ผักสดจากสวนเช้านี้..." />
              <p className="text-xs text-gray-500 text-right">{desc.length}/1000 ตัวอักษร</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!images.length || !basePrice || loading}
            className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-200 text-sm"
          >
            {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ความสดด้วย AI"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. สรุปผลและใส่จำนวน ---
const Step3 = ({ scanResult, selectedCat, onConfirm }) => {
  const [finalPrice, setFinalPrice] = useState(scanResult?.recommended_price || scanResult?.basePrice || "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const isOverPrice = Number(finalPrice) > Number(scanResult?.recommended_price);
  const selectedCategory = CATEGORIES.find(c => c.id === selectedCat);

  const handlePost = async () => {
    setLoading(true);
    try {
      const payload = {
        scan_id: scanResult.id || scanResult.scan_id,
        price: parseFloat(finalPrice),
        original_price: parseFloat(scanResult.basePrice),
        quantity: parseInt(quantity),
        unit: scanResult?.unit || 'กก.',
        description: scanResult?.desc || "",
        expired_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };
      await api.post('posts', payload);
      onConfirm();
    } catch (err) { alert("ล้มเหลว"); } finally { setLoading(false); }
  };

  return (
    <div className="p-5 max-w-5xl mx-auto animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <img src={scanResult.image_url} className="w-full aspect-square object-cover" alt="result" />
          <div className="p-4 bg-green-50">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-green-800 text-sm">คะแนนความสดจาก AI</span>
              <span className="text-xl font-black text-green-600">{scanResult.freshness_score}%</span>
            </div>
            <p className="text-xs text-green-700">{scanResult.ai_summary}</p>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-800">สรุปการลงขาย</h2>
          
          {/* Display selected data from previous steps */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">ประเภทสินค้า</span>
              <span className="font-semibold text-gray-800">{selectedCategory?.emoji} {selectedCategory?.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">ราคาตั้งต้น</span>
              <span className="font-semibold text-gray-800">฿{scanResult?.basePrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">หน่วยสินค้า</span>
              <span className="font-semibold text-gray-800">{scanResult?.unit}</span>
            </div>
            {scanResult?.desc && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">คำอธิบาย</span>
                <span className="font-semibold text-gray-800 text-right max-w-xs">{scanResult?.desc}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-600 text-sm">ราคาขายจริง (฿)</label>
              <input type="number" value={finalPrice} onChange={e => setFinalPrice(e.target.value)}
                className={`text-xl font-bold p-4 rounded-2xl border-2 outline-none ${isOverPrice ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-green-100 bg-green-50 text-green-600'}`} />
              {isOverPrice && <p className="text-orange-500 text-xs font-bold">⚠️ สูงกว่าราคาแนะนำ (฿{scanResult.recommended_price})</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-600 text-sm">จำนวนสินค้าในสต็อก</label>
              <div className="relative">
                <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)}
                  className="text-xl font-bold p-4 pr-22 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black outline-none w-full" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold pointer-events-none">{scanResult?.unit}</span>
              </div>
            </div>
          </div>

          <button onClick={handlePost} disabled={loading} className="w-full py-3 bg-green-500 text-white font-bold rounded-2xl shadow-md hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm">
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
    <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-scaleIn">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-green-600">task_alt</span>
      </div>
      <h2 className="text-2xl font-black text-gray-800 mb-2">ลงขายสำเร็จ!</h2>
      <p className="text-gray-400 mb-6 text-sm">ข้อมูลสินค้าถูกส่งไปยังหน้าร้านของคุณแล้ว</p>
      <div className="flex flex-col md:flex-row gap-3 w-full max-w-xs px-4">
        <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-black text-white font-bold rounded-xl text-sm">ไปหน้าแดชบอร์ด</button>
        <button onClick={onReset} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 text-sm">เพิ่มสินค้าเพิ่ม</button>
      </div>
    </div>
  );
};

// --- Main ---
export default function AddProduct() {
  const [step, setStep] = useState(1);
  const [selectedCat, setSelectedCat] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [images, setImages] = useState([]);
  const [basePrice, setBasePrice] = useState("");
  const [unit, setUnit] = useState(UNITS[0]);
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleReset = () => { setStep(1); setSelectedCat(null); setImages([]); setBasePrice(""); setScanResult(null); setUnit(""); setDesc(""); };

  return (
    <div className="min-h-screen bg-gray-50 font-sarabun">
      <MerchantNavbar 
        shopName="เพิ่มสินค้า" 
        ownerName={user?.name || user?.email || "เจ้าของร้าน"} 
        onLogout={logout} 
      />
      
      <div className="pt-20 py-6 px-4 flex items-start justify-center">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
          {step < 4 && (
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all">
                  <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
                </button>
                <div>
                  <h1 className="text-xl font-black text-gray-900 leading-none">เพิ่มสินค้า</h1>
                  <p className="text-gray-400 mt-1 text-sm">ขั้นตอนที่ {step} จาก 3</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-green-500' : 'w-2 bg-gray-200'}`} />)}
              </div>
            </div>
          )}

          <div className="flex-1 relative overflow-y-auto">
            {step === 1 && <Step1 onNext={() => setStep(2)} selected={selectedCat} setSelected={setSelectedCat} />}
            {step === 2 && <Step2 onAnalyze={r => { setScanResult(r); setStep(3); }} selectedCat={selectedCat} images={images} setImages={setImages} basePrice={basePrice} setBasePrice={setBasePrice} unit={unit} setUnit={setUnit} desc={desc} setDesc={setDesc} />}
            {step === 3 && <Step3 scanResult={scanResult} selectedCat={selectedCat} onConfirm={() => setStep(4)} />}
            {step === 4 && <Step4 onReset={handleReset} />}
          </div>
        </div>
      </div>
    </div>
  );
}