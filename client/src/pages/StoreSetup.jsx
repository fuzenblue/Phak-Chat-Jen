import { useState, useRef, useEffect } from "react";
import MerchantNavbar from '../components/MerchantNavbar';

const DAYS = [
  { key: "mon", label: "จันทร์" },
  { key: "tue", label: "อังคาร" },
  { key: "wed", label: "พุธ" },
  { key: "thu", label: "พฤหัสบดี" },
  { key: "fri", label: "ศุกร์" },
  { key: "sat", label: "เสาร์" },
  { key: "sun", label: "อาทิตย์" },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-emerald-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <span className="text-emerald-500">{icon}</span>
        <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return <p className="text-xs text-gray-500 mb-1.5 font-medium">{children}</p>;
}

function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition ${className}`}
    />
  );
}

function MiniMap({ lat, lng }) {
  if (!lat || !lng) {
    return (
      <div className="flex flex-col items-center justify-center h-36 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs gap-2">
        <span className="material-symbols-outlined text-gray-300">location_off</span>
        ยังไม่ได้ระบุตำแหน่ง
      </div>
    );
  }

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.005},${lng + 0.005},${lat + 0.005}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 h-40">
      <iframe title="mini-map" src={src} className="w-full h-full" style={{ border: 0 }} loading="lazy" />
      <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-2 py-1 text-[10px] text-gray-600 font-mono shadow">
        {lat.toFixed(5)}, {lng.toFixed(5)}
      </div>
    </div>
  );
}

export default function StoreSetup() {
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storeImage, setStoreImage] = useState(null);
  const [storeImagePreview, setStoreImagePreview] = useState(null);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  const [hours, setHours] = useState(
    DAYS.reduce((acc, d) => ({
      ...acc,
      [d.key]: { enabled: true, open: "09:00", close: "21:00" },
    }), {})
  );

  const fileRef = useRef();

  useEffect(() => {
    return () => {
      if (storeImagePreview) URL.revokeObjectURL(storeImagePreview);
    };
  }, [storeImagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (storeImagePreview) URL.revokeObjectURL(storeImagePreview);
    setStoreImage(file);
    setStoreImagePreview(URL.createObjectURL(file));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError("เบราว์เซอร์ไม่รองรับ");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocLoading(false);
      },
      () => {
        setLocError("กรุณาอนุญาตการเข้าถึงตำแหน่ง");
        setLocLoading(false);
      }
    );
  };

  const toggleDay = (key, val) => {
    setHours((prev) => ({ ...prev, [key]: { ...prev[key], enabled: val } }));
  };

  const setDayTime = (key, field, val) => {
    setHours((prev) => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const validCoords = !isNaN(parsedLat) && !isNaN(parsedLng);

  return (
    <div className="min-h-screen bg-gray-50 font-sarabun">
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Prompt:wght@400;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      <MerchantNavbar 
        shopName={storeName || "ชื่อร้านของคุณ"} 
        ownerName="Merchant Admin" 
        onLogout={() => console.log("Logout")} 
      />

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        <Card title="ข้อมูลร้าน" icon={<span className="material-symbols-outlined text-[20px]">storefront</span>}>
          <div className="space-y-4">
            <div>
              <Label>ชื่อร้าน</Label>
              <Input value={storeName} onChange={setStoreName} placeholder="ชื่อร้านของคุณ" />
            </div>
            <div>
              <Label>รายละเอียดร้าน</Label>
              <textarea
                value={storeDesc}
                onChange={(e) => setStoreDesc(e.target.value)}
                placeholder="อธิบายร้านของคุณ..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
              />
            </div>
            <div>
              <Label>รูปโปรไฟล์ร้าน</Label>
              <div onClick={() => fileRef.current.click()} className="flex items-center gap-4 cursor-pointer group">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-emerald-400 transition overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                  {storeImagePreview ? (
                    <img src={storeImagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-emerald-400">add_a_photo</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-600">{storeImage ? "เปลี่ยนรูป" : "อัปโหลดรูป"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG ขนาดไม่เกิน 5MB</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>
        </Card>

        <Card title="ตำแหน่งร้าน" icon={<span className="material-symbols-outlined text-[20px]">distance</span>}>
          <div className="space-y-4">
            <button
              onClick={handleGetLocation}
              disabled={locLoading}
              className="w-full flex items-center justify-center gap-2 border border-emerald-400 text-emerald-600 hover:bg-emerald-50 rounded-xl py-2.5 text-sm font-semibold transition"
            >
              <span className={`material-symbols-outlined text-[18px] ${locLoading ? 'animate-spin' : ''}`}>
                {locLoading ? 'progress_activity' : 'near_me'}
              </span>
              {locLoading ? "กำลังดึงตำแหน่ง..." : "ใช้ตำแหน่งปัจจุบัน"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>ละติจูด</Label>
                <Input value={lat} onChange={setLat} placeholder="13.7563" />
              </div>
              <div>
                <Label>ลองจิจูด</Label>
                <Input value={lng} onChange={setLng} placeholder="100.5018" />
              </div>
            </div>
            <MiniMap lat={validCoords ? parsedLat : null} lng={validCoords ? parsedLng : null} />
          </div>
        </Card>

        <Card title="เวลาทำการ" icon={<span className="material-symbols-outlined text-[20px]">schedule</span>}>
          <div className="space-y-1">
            {DAYS.map((day, idx) => {
              const h = hours[day.key];
              return (
                <div key={day.key} className={`flex items-center gap-3 py-2.5 ${idx < DAYS.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <Toggle checked={h.enabled} onChange={(v) => toggleDay(day.key, v)} />
                  <span className={`text-sm w-16 ${h.enabled ? "text-gray-700 font-medium" : "text-gray-300"}`}>{day.label}</span>
                  {h.enabled ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input type="time" value={h.open} onChange={(e) => setDayTime(day.key, "open", e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 flex-1" />
                      <span className="text-gray-300 text-xs">–</span>
                      <input type="time" value={h.close} onChange={(e) => setDayTime(day.key, "close", e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 flex-1" />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300 italic">ปิดทำการ</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <button className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-emerald-100 text-sm mb-8">
          บันทึกข้อมูลร้าน
        </button>
      </div>
    </div>
  );
}