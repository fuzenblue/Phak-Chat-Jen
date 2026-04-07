import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ เพิ่ม useNavigate
import api from "../services/api";

const CATEGORIES = [
  { id: 1, emoji: "🥬", name: "ผักกาด", color: "#e8f5e9" },
  { id: 2, emoji: "🍅", name: "มะเขือเทศ", color: "#fce4ec" },
  { id: 3, emoji: "🥦", name: "คะน้า", color: "#e8f5e9" },
  { id: 4, emoji: "🥕", name: "แครอท", color: "#fff3e0" },
  { id: 5, emoji: "🥬", name: "กะหล่ำปลี", color: "#e8f5e9" },
  { id: 6, emoji: "🌶️", name: "พริก", color: "#fce4ec" },
  { id: 7, emoji: "🥒", name: "แตงกวา", color: "#e8f5e9" },
  { id: 8, emoji: "🌽", name: "ข้าวโพด", color: "#fff9c4" },
  { id: 9, emoji: "🍆", name: "มะเขือ", color: "#f3e5f5" },
  { id: 10, emoji: "🎃", name: "ฟักทอง", color: "#fff3e0" },
  { id: 11, emoji: "🥬", name: "ผักโขม", color: "#e8f5e9" },
  { id: 12, emoji: "🫘", name: "ถั่ว", color: "#efebe9" },
  { id: 13, emoji: "🧄", name: "กระเทียม", color: "#fafafa" },
  { id: 14, emoji: "🧅", name: "หัวหอม", color: "#fff3e0" },
  { id: 15, emoji: "🍄", name: "เห็ด", color: "#efebe9" },
  { id: 16, emoji: "🫚", name: "ผักชี", color: "#e8f5e9" },
  { id: 17, emoji: "🌱", name: "ต้นอ่อนทานตะวัน", color: "#f1f8e9" },
  { id: 18, emoji: "🥬", name: "ใบกระเพรา", color: "#8be392" },
  { id: 19, emoji: "🍈", name: "มะละกอ", color: "#f05411" },
];

const UNITS = ["บาท/กก.", "บาท/กำ", "บาท/แพ็ก", "บาท/ลูก", "บาท/มัด"];

const ProgressBar = ({ step, total }) => (
  <div className="px-5 pt-4 pb-2">
    <div className="relative h-1.5 bg-green-100 rounded-full overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
    <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
      <span>ขั้นตอน {step}/{total}</span>
      <span>{step === 1 ? "เลือกประเภท" : step === 2 ? "อัปโหลดรูป" : step === 3 ? "ผล AI" : "สรุป"}</span>
    </div>
  </div>
);

const Step1 = ({ onNext, selected, setSelected }) => {
  const [search, setSearch] = useState("");
  const filtered = CATEGORIES.filter(c => c.name.includes(search));

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-3 pb-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาประเภทสินค้า..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <p className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">เลือกประเภทสินค้า</p>
        <div className="grid grid-cols-3 gap-3 pb-32">
          {filtered.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                selected === cat.id
                  ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                  : "border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/50"
              }`}
            >
              {selected === cat.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                </div>
              )}
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className={`text-xs font-medium text-center leading-tight ${selected === cat.id ? "text-green-700" : "text-gray-600"}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-6 pt-3 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 px-1">
            <span className="text-lg">{CATEGORIES.find(c => c.id === selected)?.emoji}</span>
            <span className="text-sm text-gray-600">
              เลือก: <span className="font-semibold text-gray-800">{CATEGORIES.find(c => c.id === selected)?.name}</span>
            </span>
          </div>
          <button
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            ถัดไป
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

const Step2 = ({ onAnalyze, selectedCat, images, setImages, basePrice, setBasePrice, unit, setUnit, desc, setDesc }) => {
  const navigate = useNavigate(); // ✅ ดึง navigate มาใช้
  const [showUnit, setShowUnit] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFiles = useCallback((files) => {
    const newImgs = Array.from(files).slice(0, 5 - images.length).map(f => ({
      id: Math.random(),
      url: URL.createObjectURL(f),
      file: f
    }));
    setImages(prev => [...prev, ...newImgs].slice(0, 5));
  }, [images]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (id) => setImages(prev => prev.filter(i => i.id !== id));
  const canAnalyze = images.length > 0 && basePrice && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', images[0].file);
      formData.append('veg_type', CATEGORIES.find(c => c.id === selectedCat).name);
      formData.append('original_price', basePrice);
      formData.append('description', desc);

      const response = await api.post('v1/scans', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // ✅ Log ส่องข้อมูลจาก AI เพื่อความชัวร์เวลาแก้บัค
      console.log("🔥 ข้อมูลจาก AI (Scan Result):", response.data);

      onAnalyze({ ...response.data.data, basePrice, unit, desc });
    } catch (err) {
      // ✅ ใช้ navigate ได้แล้ว
      if (err.response?.status === 404 || err.response?.data?.error?.code === 'SHOP_NOT_FOUND') {
        alert("กรุณาตั้งค่าร้านค้าก่อนใช้งานระบบสแกนครับ");
        navigate('/merchant/setup'); // เช็ค path ด้วยนะครับว่าตรงกับหน้า Setup ไหม
        return;
      }
      console.error("Scan error:", err);
      const msg = err.response?.data?.error?.message || err.response?.data?.message || "เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32">
      <div className="px-5 pt-3 space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">รูปสินค้า {loading && "(กำลังอัปโหลด...)"}</p>
          {images.length === 0 ? (
            <div
              onClick={() => !loading && fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-green-200 rounded-2xl bg-green-50/40 flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-green-50 transition-colors"
            >
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-green-500 text-[28px]">upload</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">คลิกเพื่ออัปโหลดรูป</p>
              <p className="text-xs text-gray-400 mt-1">หรือถ่ายรูปสินค้า</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-lg font-medium">หลัก</div>
                  )}
                  <button
                    disabled={loading}
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-white text-[14px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">ราคาตั้งต้น</p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">฿</span>
              <input
                value={basePrice}
                onChange={e => setBasePrice(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                type="number"
                className="w-full pl-7 pr-3 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUnit(!showUnit)}
                className="flex items-center gap-1 px-3 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-medium whitespace-nowrap"
              >
                {unit} <span className={`material-symbols-outlined text-[18px] transition-transform ${showUnit ? "rotate-180" : ""}`}>expand_more</span>
              </button>
              {showUnit && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10 min-w-max">
                  {UNITS.map(u => (
                    <button
                      key={u}
                      onClick={() => { setUnit(u); setShowUnit(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 ${u === unit ? "text-green-600 font-semibold bg-green-50" : "text-gray-700"}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">รายละเอียดสินค้าเพิ่มเติม</p>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="เช่น ผักสดจากสวน..."
            rows={3}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-6 pt-3 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={() => canAnalyze && handleSubmit()}
          disabled={!canAnalyze || loading}
          className={`w-full py-4 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all ${
            canAnalyze && !loading
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200 active:scale-98"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
             <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              วิเคราะห์ด้วย AI
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Step3 = ({ scanResult, onConfirm }) => {
  const [finalPrice, setFinalPrice] = useState(scanResult?.recommended_price || scanResult?.basePrice || "");
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const handlePost = async () => {
    setLoading(true);
    try {
      const shelfLife = scanResult.estimated_shelf_life_days || 3;
      const expiredAt = new Date(Date.now() + shelfLife * 24 * 60 * 60 * 1000).toISOString();

      const payload = {
        scan_id: scanResult.id || scanResult.scan_id,
        price: Number(finalPrice),
        original_price: Number(scanResult.basePrice),
        quantity: Number(quantity),
        rating: rating > 0 ? rating : null,
        expired_at: expiredAt,
        status: 'active'
      };

      await api.post('v1/posts', payload);
      onConfirm();
    } catch (err) {
      console.error("Post error:", err);
      alert("ไม่สามารถลงขายสินค้าได้");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = scanResult.freshness_score >= 75 ? "#22c55e" : scanResult.freshness_score >= 50 ? "#eab308" : "#f97316";

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32">
      <div className="px-5 pt-3 space-y-4">
        <p className="text-base font-bold text-gray-800">ผลการวิเคราะห์ AI</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex gap-4">
            <img src={scanResult.image_url} alt="" className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500">ความสด</span>
                <span className="text-xl font-bold" style={{ color: scoreColor }}>{scanResult.freshness_score || 0}/100</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full transition-all duration-1000" style={{ width: `${scanResult.freshness_score || 0}%`, background: scoreColor }} />
              </div>
              <div className="bg-blue-50 rounded-xl p-2.5">
                <p className="text-xs leading-relaxed text-blue-700">{scanResult.ai_summary || "ไม่พบคำอธิบายจาก AI"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <p className="text-sm font-bold text-gray-800">ตั้งราคาและจำนวน</p>
          <div className="flex items-center justify-between py-2 bg-gray-50 -mx-4 px-4">
            <span className="text-sm text-gray-600">
              ราคาตั้งต้น: <span className="line-through text-gray-400 mr-1">฿{scanResult.basePrice}</span>
              {scanResult.recommended_discount_percent ? <span className="text-green-600 font-semibold text-xs bg-green-100 px-1 rounded">(ลด {scanResult.recommended_discount_percent}%)</span> : null}
            </span>
            {scanResult.recommended_price && (
              <span className="text-sm font-bold text-green-600">แนะนำ: ฿{scanResult.recommended_price}</span>
            )}
          </div>
          
          
          <div className="flex gap-3 mt-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">฿</span>
              <input
                value={finalPrice}
                onChange={e => setFinalPrice(e.target.value)}
                type="number"
                placeholder="ราคาขาย"
                className="w-full pl-7 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="relative w-1/3">
              <input
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                type="number"
                min="1"
                placeholder="จำนวน"
                className="w-full pl-4 pr-8 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-xs">ชิ้น</span>
            </div>
          </div>

          {/* ─── Rating ─── */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">ให้คะแนนสินค้า (ไม่บังคับ)</p>
            <div className="rating rating-lg gap-1">
              {[1,2,3,4,5].map(star => (
                <input
                  key={star}
                  type="radio"
                  name="product-rating"
                  className="mask mask-star-2 bg-amber-400"
                  checked={rating === star}
                  onChange={() => setRating(star)}
                  aria-label={`${star} stars`}
                />
              ))}
            </div>
            {rating > 0 && (
              <button type="button" onClick={() => setRating(0)} className="text-xs text-gray-400 underline mt-1">
                ล้างคะแนน
              </button>
            )}
          </div>

        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-6 pt-3 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={handlePost}
          disabled={loading || !finalPrice || !quantity}
          className={`w-full py-4 font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all ${
            loading || !finalPrice || !quantity
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200"
          }`}
        >
          {loading ? (
             <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              ยืนยันและลงขายสินค้า
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Step4 = ({ onReset }) => {
  const navigate = useNavigate(); 
  
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[32px]">check</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">ลงขายสำเร็จ! 🎉</h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">สินค้าของคุณถูกบันทึกลงในระบบเรียบร้อยแล้ว</p>
      
      <div className="w-full space-y-3">
        {/* ✅ ปุ่มหลักสีเขียว: ให้ Navigate ไปหน้ารายการสินค้า */}
        <button
          onClick={() => navigate('/dashboard')} // ⚠️ เช็ค URL ตรงนี้ให้ตรงกับ Route หน้าสินค้านะครับ (เช่น /products หรือ /merchant/products)
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg shadow-green-200"
        >
          กลับหน้ารายการสินค้า
        </button>
        
        {/* ✅ ปุ่มรองสีขาว: เก็บไว้เผื่ออยากลงผักเพิ่มเลย */}
        <button
          onClick={onReset}
          className="w-full py-4 bg-white border border-gray-200 text-gray-600 font-semibold rounded-2xl shadow-sm hover:bg-gray-50"
        >
          เพิ่มสินค้าใหม่อีกชิ้น
        </button>
      </div>
    </div>
  );
};

export default function AddProduct() {
  const [step, setStep] = useState(1);
  const [selectedCat, setSelectedCat] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [images, setImages] = useState([]);
  const [basePrice, setBasePrice] = useState("");
  const [unit, setUnit] = useState(UNITS[0]);
  const [desc, setDesc] = useState("");

  const handleBack = () => { if (step > 1) setStep(s => s - 1); };
  const handleAnalyze = (result) => { setScanResult(result); setStep(3); };
  const handleConfirm = () => setStep(4);
  const handleReset = () => { setStep(1); setSelectedCat(null); setScanResult(null); setImages([]); setBasePrice(""); setUnit(UNITS[0]); setDesc(""); };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center font-sans">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col shadow-xl">
        {step < 4 && (
          <div className="sticky top-0 bg-white z-10 border-b border-gray-50">
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
              <button
                onClick={handleBack}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95"
              >
                <span className="material-symbols-outlined text-gray-700 text-[20px]">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-gray-900">เพิ่มสินค้าใหม่</h1>
            </div>
            <ProgressBar step={step} total={4} />
          </div>
        )}
        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 1 && <Step1 onNext={() => setStep(2)} selected={selectedCat} setSelected={setSelectedCat} />}
          {step === 2 && <Step2 onAnalyze={handleAnalyze} selectedCat={selectedCat} images={images} setImages={setImages} basePrice={basePrice} setBasePrice={setBasePrice} unit={unit} setUnit={setUnit} desc={desc} setDesc={setDesc} />}
          {step === 3 && <Step3 scanResult={scanResult} onConfirm={handleConfirm} />}
          {step === 4 && <Step4 onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
}