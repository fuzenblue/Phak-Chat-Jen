import { useNavigate, useParams } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';

const MOCK_SHOPS_DATA = {
  's-001': {
    info: {
      id: 's-001',
      name: 'ป้าแดงผักสดคลองเตย',
      description: 'ผักสดส่งตรงจากสวน คัดสรรคุณภาพทุกวัน ประสบการณ์กว่า 20 ปี',
      image_url: 'https://images.unsplash.com/photo-1488459711621-27bef697b055?q=80&w=400&auto=format&fit=crop',
      is_open: true,
      opening_hours: '05:00 - 18:00',
      address: 'ตลาดคลองเตย แผงที่ 12 ถนนพระราม 4 กรุงเทพฯ',
      latitude: 13.7274, longitude: 100.5230
    },
    products: [
      { id: 1, name: 'กะหล่ำปลี', type: 'ผักกาด', freshness_score: 92, price: 25, original_price: null, ai_summary: 'ผักมีความสดใหม่มาก ใบกรอบแน่น ไม่มีรอยช้ำ สีเขียวอ่อนสม่ำเสมอ คุณภาพเกรด A', image_url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=400&auto=format&fit=crop' },
      { id: 2, name: 'มะเขือเทศราชินี', type: 'ผล', freshness_score: 75, price: 35, original_price: 45, ai_summary: 'ผิวตึงดี มีความหวานตามธรรมชาติ มีตำหนิเล็กน้อยที่ขั้ว แต่ยังคงรสชาติที่ดี', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop' },
      { id: 3, name: 'ผักบุ้งจีน', type: 'ผักใบ', freshness_score: 58, price: 15, original_price: 25, ai_summary: 'เริ่มมีอาการสลดเล็กน้อยที่ปลายใบแต่ยังล้างน้ำใช้ได้ แนะนำให้ปรุงสุกทันทีเพื่อความอร่อย', image_url: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=400&auto=format&fit=crop' },
    ]
  },
  's-002': {
    info: {
      id: 's-002',
      name: 'สวนผักลุงสมบัติดี',
      description: 'ผักปลอดสารจากสวนออร์แกนิก ปลูกเอง ขายเอง สดทุกวัน',
      image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop',
      is_open: true,
      opening_hours: '06:00 - 17:00',
      address: 'ซอยสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพฯ',
      latitude: 13.7290, longitude: 100.5250
    },
    products: [
      { id: 1, name: 'ผักคะน้า', type: 'ผักใบ', freshness_score: 88, price: 15, original_price: null, ai_summary: 'ใบเขียวเข้ม ก้านกรอบ ไม่มีรอยเจาะของแมลง คุณภาพดีมาก', image_url: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=400&auto=format&fit=crop' },
      { id: 2, name: 'แตงกวา', type: 'ผล', freshness_score: 90, price: 10, original_price: null, ai_summary: 'ผิวเรียบเขียวสด เนื้อกรอบ เมล็ดน้อย เหมาะรับประทานสด', image_url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=400&auto=format&fit=crop' },
    ]
  },
  's-003': {
    info: {
      id: 's-003',
      name: 'ร้านผักออร์แกนิก เจ๊พร',
      description: 'ผักออร์แกนิกคัดเกรดพรีเมียม จากไร่จังหวัดนครปฐม ส่งตรงถึงมือ',
      image_url: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=400&auto=format&fit=crop',
      is_open: true,
      opening_hours: '07:00 - 19:00',
      address: 'ตลาดรวมทรัพย์ ถนนรัชดาภิเษก เขตดินแดง กรุงเทพฯ',
      latitude: 13.7250, longitude: 100.5210
    },
    products: [
      { id: 1, name: 'ผักสลัดมิกซ์', type: 'ผักใบ', freshness_score: 95, price: 45, original_price: null, ai_summary: 'ใบสดกรอบ สีเขียวอมแดงสวยงาม ปลอดสาร 100% เกรดพรีเมียม', image_url: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=400&auto=format&fit=crop' },
      { id: 2, name: 'บรอกโคลี', type: 'ผักกาด', freshness_score: 82, price: 55, original_price: 65, ai_summary: 'ดอกแน่นสีเขียวเข้ม ก้านกรอบ ไม่มีจุดเหลือง คุณภาพส่งออก', image_url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=400&auto=format&fit=crop' },
      { id: 3, name: 'มะเขือม่วง', type: 'ผล', freshness_score: 70, price: 30, original_price: null, ai_summary: 'ผิวมันเงา สีม่วงเข้ม เนื้อแน่น เหมาะย่างหรือผัด', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop' },
    ]
  },
  's-004': {
    info: {
      id: 's-004',
      name: 'กะหล่ำปลีสายน้ำผึ้ง',
      description: 'ขายผักสดราคาย่อมเยาว์ เน้นผักพื้นบ้าน ปลูกจากสวนหลังบ้าน',
      image_url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=400&auto=format&fit=crop',
      is_open: false,
      opening_hours: '05:30 - 14:00',
      address: 'ตลาดเช้าบางกะปิ ซอยลาดพร้าว 130 กรุงเทพฯ',
      latitude: 13.7310, longitude: 100.5280
    },
    products: [
      { id: 1, name: 'กะหล่ำปลี', type: 'ผักกาด', freshness_score: 85, price: 20, original_price: null, ai_summary: 'หัวแน่น ใบซ้อนกันดี น้ำหนักดี เหมาะทำผัด-แกง-สลัด', image_url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=400&auto=format&fit=crop' },
      { id: 2, name: 'ถั่วฝักยาว', type: 'ผล', freshness_score: 65, price: 18, original_price: 22, ai_summary: 'ฝักยาวตรง สีเขียวอ่อน เมล็ดเล็ก เริ่มมีจุดน้ำตาลบ้างเล็กน้อย', image_url: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=400&auto=format&fit=crop' },
    ]
  },
  's-005': {
    info: {
      id: 's-005',
      name: 'ผักตลาดเช้ายิ้มสู้',
      description: 'ผักราคาประหยัด สดใหม่ทุกเช้า จากเกษตรกรท้องถิ่น',
      image_url: 'https://images.unsplash.com/photo-1488459711621-27bef697b055?q=80&w=400&auto=format&fit=crop',
      is_open: true,
      opening_hours: '04:30 - 12:00',
      address: 'ตลาดเช้าคลองเตย ถนนพระราม 4 กรุงเทพฯ',
      latitude: 13.7230, longitude: 100.5260
    },
    products: [
      { id: 1, name: 'ต้นหอม', type: 'ผักใบ', freshness_score: 93, price: 12, original_price: null, ai_summary: 'ใบเขียวสด ก้านขาวตรง กลิ่นหอม เหมาะโรยหน้าอาหาร', image_url: 'https://images.unsplash.com/photo-1550143813-fdf696803212?q=80&w=400&auto=format&fit=crop' },
      { id: 2, name: 'พริกขี้หนู', type: 'ผล', freshness_score: 88, price: 20, original_price: null, ai_summary: 'เม็ดเล็ก สีเขียวสด ความเผ็ดจัดจ้าน สดใหม่จากไร่', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop' },
      { id: 3, name: 'ผักชี', type: 'ผักใบ', freshness_score: 48, price: 8, original_price: 15, ai_summary: 'เริ่มเหี่ยวเล็กน้อย แต่กลิ่นยังหอม ควรใช้ภายในวันนี้', image_url: 'https://images.unsplash.com/photo-1488459711621-27bef697b055?q=80&w=400&auto=format&fit=crop' },
    ]
  }
};

const DEFAULT_SHOP_ID = 's-001';

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find the shop by URL param, fallback to first shop
  const shopData = MOCK_SHOPS_DATA[id] || MOCK_SHOPS_DATA[DEFAULT_SHOP_ID];
  const MOCK_SHOP = shopData.info;
  const MOCK_PRODUCTS = shopData.products;

  const getFreshnessStatus = (score) => {
    if (score >= 75) return { label: 'สด', color: 'bg-green-100 text-green-600' };
    if (score >= 50) return { label: 'ใกล้หมด', color: 'bg-yellow-100 text-yellow-600' };
    return { label: 'ควรเร่งขาย', color: 'bg-red-100 text-red-500' };
  };

  const getFreshnessBarColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleNavigate = () => {
    window.open(`https://www.google.com/maps?q=${MOCK_SHOP.latitude},${MOCK_SHOP.longitude}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt pb-10 pt-14">
      <CustomerNavbar title="ร้านและสินค้า" back />
      <main className="py-6 space-y-6">
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div className="flex gap-4">
            <img src={MOCK_SHOP.image_url} alt={MOCK_SHOP.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-gray-100 shrink-0"/>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-bold text-lg text-gray-800 leading-tight truncate">
                  {MOCK_SHOP.name}
                </h2>
                <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${MOCK_SHOP.is_open ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {MOCK_SHOP.is_open ? 'เปิดอยู่' : 'ปิดแล้ว'}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {MOCK_SHOP.description}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-gray-400">schedule</span>
              <span>วันนี้เปิด {MOCK_SHOP.opening_hours}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0 mt-0.5">location_on</span>
              <span className="line-clamp-2">{MOCK_SHOP.address}</span>
            </div>
          </div>

          <button onClick={handleNavigate} className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold rounded-2xl py-3.5 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">directions</span>
            นำทางไปร้าน
          </button>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              สินค้าในร้าน 
              <span className="text-gray-400 font-normal text-sm">({MOCK_PRODUCTS.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {MOCK_PRODUCTS.map(product => {
              const status = getFreshnessStatus(product.freshness_score);
              const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

              return (
                <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-500 hover:scale-102 ">
                  <div className="relative w-full aspect-square bg-gray-100">
                    <img src={product.image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover"/>
                    {discount > 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg shadow-sm">
                          -{discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 space-y-2">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-gray-800 truncate text-sm">
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400 font-medium">
                          {product.type}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mr-2">
                          <div className={`h-full ${getFreshnessBarColor(product.freshness_score)} transition-all`} style={{ width: `${product.freshness_score}%` }}/>
                        </div>
                        <span className="shrink-0 font-bold text-gray-500 font-funnel">{product.freshness_score}/100</span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-snug">
                        {product.ai_summary}
                      </p>
                    </div>

                    <div className="pt-1 mt-auto flex items-baseline gap-1.5">
                      <span className="text-green-600 font-bold font-funnel text-base">฿{product.price}</span>
                      {product.original_price && (
                        <span className="text-gray-300 line-through text-[10px] font-funnel">฿{product.original_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
