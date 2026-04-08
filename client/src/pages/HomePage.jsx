import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';

function SectionLabel({ text }) {
  return (
    <p className="text-xs font-bold tracking-widest text-green-500 uppercase mb-2">
      {text}
    </p>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['แก้ปัญหาได้อย่างไร', 'วิธีใช้งาน'];

  return (
    <div className="font-prompt scroll-smooth">
      <CustomerNavbar />

      <section
        id="hero"
        className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center text-center px-4 pt-14"
      >

        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 inline-block">
          DE461 Final Project 2026
        </span>

        <h1 className="text-6xl font-black text-green-600 mb-2">Phak Chat Jen - ผักชัดเจน</h1>

        <p className="text-2xl font-bold text-gray-700 mb-4">แพลตฟอร์มผักสดอัจฉริยะ</p>

        <p className="text-gray-500 text-base max-w-lg text-center leading-relaxed">
          ช่วยผู้ค้าตั้งราคาแบบ Dynamic และช่วยผู้ซื้อค้นหาผักสดราคาดีในพื้นที่
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate('/map')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-colors"
          >
            ลองใช้งาน Demo
          </button>
          <button
            onClick={() => window.open('https://github.com/fuzenblue/Phak-Chat-Jen.git', '_blank')}
            className="border-2 border-green-500 text-green-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-green-50 transition-colors"
          >
            ดู Source Code
          </button>
        </div>
      </section>

      <section id="about" className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <SectionLabel text="ABOUT" />
          <h2 className="text-3xl font-black text-gray-800 mb-4">ผักชัดเจนคืออะไร?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left*/}
          <p className="text-gray-600 leading-relaxed">
            ผักชัดเจน คือแพลตฟอร์มเว็บแอปพลิเคชันที่เชื่อมโยงผู้ค้าผักรายย่อยกับผู้บริโภคในพื้นที่ใกล้เคียง
            โดยใช้ AI วิเคราะห์ความสดของผักจากรูปถ่าย และแนะนำราคาขายที่เหมาะสมแบบ Dynamic Pricing
            พร้อม AI Agent ที่ช่วยปรับราคาอัตโนมัติตามสภาพผักและเวลาที่เหลือก่อนปิดร้าน
          </p>

          {/* Right*/}
          <div className="flex flex-col gap-4">
            {[
              { icon: 'smart_toy', text: 'AI วิเคราะห์ความสดจากรูปถ่าย' },
              { icon: 'location_on', text: 'แผนที่แสดงร้านค้าใกล้เคียงแบบ Real-time' },
              { icon: 'payments', text: 'Dynamic Pricing อัตโนมัติด้วย AI Agent' },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="bg-green-50 rounded-2xl p-4 flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-green-600 text-2xl">{icon}</span>
                <span className="font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="problem" className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <SectionLabel text="PROBLEM" />
          <h2 className="text-3xl font-black text-gray-800 mb-2">ปัญหาที่เราพบ</h2>
          <p className="text-gray-500">ทำไมเรื่องนี้ถึงสำคัญ?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: 'storefront',
              iconBg: 'bg-orange-100',
              iconColor: 'text-orange-500',
              title: 'ผู้ค้าไม่มีเครื่องมือประเมินราคา',
              body: 'ผู้ค้ารายย่อยต้องตั้งราคาด้วยประสบการณ์ส่วนตัว ไม่มีข้อมูลอ้างอิง ทำให้ขายได้ราคาต่ำหรือขายไม่ออกจนผักเน่าเสีย',
            },
            {
              icon: 'search',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-500',
              title: 'ผู้ซื้อหาผักราคาดีไม่เจอ',
              body: 'ผู้บริโภคไม่รู้ว่าร้านค้าใกล้บ้านมีผักอะไรบ้าง ราคาเท่าไหร่ เปิดอยู่หรือเปล่า ต้องเสียเวลาเดินหาเอง',
            },
            {
              icon: 'recycling',
              iconBg: 'bg-red-100',
              iconColor: 'text-red-500',
              title: 'Food Waste จากการตั้งราคาผิดพลาด',
              body: 'ผักที่ขายไม่ออกในเวลาที่เหมาะสมกลายเป็นขยะอาหาร ส่งผลกระทบต่อสิ่งแวดล้อมและรายได้ของผู้ค้า',
            },
          ].map(({ icon, iconBg, iconColor, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            >
              <div
                className={`${iconBg} ${iconColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
              >
                <span className="material-symbols-outlined text-2xl">{icon}</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="solutions" className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <SectionLabel text="SOLUTIONS EXPLORED" />
          <h2 className="text-3xl font-black text-gray-800 mb-2">แนวทางที่เป็นไปได้</h2>
          <p className="text-gray-500">
            เราพิจารณาหลายแนวทางก่อนเลือก approach ที่เหมาะสมที่สุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Card 1 — Selected */}
          <div className="rounded-3xl p-6 border-2 border-green-500 bg-green-50">
            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 mb-3 inline-block">
              เลือกใช้
            </span>
            <h3 className="font-bold text-green-700 mb-2">AI-powered Web Application + Agent</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              ใช้ Vision AI วิเคราะห์รูปผัก + AI Agent ปรับราคาอัตโนมัติ + แผนที่แสดงร้านใกล้เคียง
            </p>
          </div>

          {[
            {
              title: 'Mobile App (Native)',
              body: 'พัฒนา iOS/Android แยก — ต้นทุนสูง ใช้เวลานาน ไม่เหมาะกับ scope ของโปรเจคนี้',
            },
            {
              title: 'Line OA + Chatbot',
              body: 'ใช้ Line เป็นช่องทาง — ง่ายต่อการเข้าถึง แต่จำกัด UI และ feature ที่ซับซ้อน',
            },
            {
              title: 'Excel / Manual System',
              body: 'บันทึกข้อมูลด้วยตัวเอง — ไม่ scalable ไม่มี real-time และไม่รองรับ AI analysis',
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-3xl p-6 border-2 border-gray-200 bg-white opacity-70"
            >
              <span className="bg-gray-100 text-gray-500 text-xs rounded-full px-2 py-0.5 mb-3 inline-block">
                พิจารณาแล้ว
              </span>
              <h3 className="font-bold text-gray-600 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="methodology" className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <SectionLabel text="METHODOLOGY" />
          <h2 className="text-3xl font-black text-gray-800 mb-2">วิธีการที่เลือกใช้</h2>
          <p className="text-gray-500 mb-6">
            Web Application ที่ผสาน AI Vision, Dynamic Pricing และ Location-based Discovery
          </p>
          <p className="max-w-2xl mx-auto text-center text-gray-600 mb-10 leading-relaxed">
            เราเลือกพัฒนาเป็น Web Application เนื่องจาก accessible บนทุกอุปกรณ์โดยไม่ต้องติดตั้ง app
            ใช้ React + Node.js + PostgreSQL + PostGIS เป็น stack หลัก และผสาน Qwen VL สำหรับ AI Vision
            พร้อม AI Agent loop ที่ทำงานเบื้องหลังทุก 1 ชั่วโมง
          </p>

          {/* Tab bar */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === i
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl mx-auto text-left">
            {/* Tab 0 — แก้ปัญหาได้อย่างไร */}
            {activeTab === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3">ฝั่งผู้ค้า</h3>
                  <ul className="space-y-2">
                    {[
                      'ถ่ายรูปผัก AI วิเคราะห์ความสดและแนะนำราคา',
                      'AI Agent ปรับราคาอัตโนมัติตามสภาพจริง',
                      'ลด Food Waste จากการขายไม่ออก',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 font-bold mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3">ฝั่งผู้ซื้อ</h3>
                  <ul className="space-y-2">
                    {[
                      'แผนที่แสดงร้านที่เปิดอยู่ในรัศมีที่ต้องการ',
                      'เห็นความสดและราคาก่อนตัดสินใจ',
                      'ประหยัดเวลาและค่าใช้จ่าย',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 font-bold mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Flow Merchant */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">storefront</span> <span>ผู้ค้า</span>
                  </h3>
                  <div className="flex flex-col gap-4">
                    {[
                      'สมัครและตั้งค่าร้านค้า',
                      'ถ่ายรูปผักและกรอกราคาตั้งต้น',
                      'AI วิเคราะห์และแนะนำราคา กด Confirm',
                      'AI Agent ดูแลและปรับราคาอัตโนมัติ',
                    ].map((step, i) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flow Consumer */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">shopping_bag</span> <span>ผู้ซื้อ</span>
                  </h3>
                  <div className="flex flex-col gap-4">
                    {[
                      'เปิดแผนที่ เห็นร้านใกล้ที่เปิดอยู่',
                      'กรองตามประเภทผักและรัศมี',
                      'กดดูรายละเอียดร้านและนำทางไป',
                    ].map((step, i) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="impact" className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <SectionLabel text="IMPACT" />
          <h2 className="text-3xl font-black text-gray-800">ผลลัพธ์ที่คาดหวัง</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            {
              gradient: 'from-green-50 to-emerald-50',
              border: 'border-green-100',
              icon: 'payments',
              metric: '15-40%',
              metricColor: 'text-green-600',
              label: 'รายได้ผู้ค้าเพิ่มขึ้น',
              sub: 'จากการตั้งราคาที่แม่นยำขึ้น',
            },
            {
              gradient: 'from-blue-50 to-cyan-50',
              border: 'border-blue-100',
              icon: 'timer',
              metric: '3x',
              metricColor: 'text-blue-600',
              label: 'ความเร็วในการตัดสินใจ',
              sub: 'ไม่ต้องประเมินราคาด้วยตัวเอง',
            },
            {
              gradient: 'from-orange-50 to-red-50',
              border: 'border-orange-100',
              icon: 'recycling',
              metric: 'ลด Food Waste',
              metricColor: 'text-orange-600',
              label: 'ผักขายออกก่อนเน่าเสีย',
              sub: 'ด้วย Dynamic Pricing อัตโนมัติ',
            },
            {
              gradient: 'from-purple-50 to-pink-50',
              border: 'border-purple-100',
              icon: 'map',
              metric: 'Real-time',
              metricColor: 'text-purple-600',
              label: 'ค้นหาผักสดใกล้บ้านได้ทันที',
              sub: 'ผ่านแผนที่ในโทรศัพท์',
            },
          ].map(({ gradient, border, icon, metric, metricColor, label, sub }) => (
            <div
              key={label}
              className={`bg-gradient-to-br ${gradient} border ${border} rounded-3xl p-6 text-center`}
            >
              <div className="mb-3">
                <span className={`material-symbols-outlined text-4xl ${metricColor}`}>{icon}</span>
              </div>
              <p className={`text-3xl font-black ${metricColor} leading-tight`}>{metric}</p>
              <p className="font-semibold text-gray-700 mt-1">{label}</p>
              <p className="text-xs text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="get-started" className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="GET STARTED" />
            <h2 className="text-3xl font-black text-gray-800">ลองใช้งานได้เลย</h2>
          </div>

          {/* Demo + GitHub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Card A — Try Demo */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white">
              <div className="mb-3">
                <span className="material-symbols-outlined text-[40px]">map</span>
              </div>
              <h3 className="text-2xl font-black">Try Demo</h3>
              <p className="text-green-100 text-sm mt-1">
                ลองใช้งานระบบจริงได้เลย
              </p>
              <button
                onClick={() => navigate('/map')}
                className="bg-white text-green-600 font-bold rounded-2xl px-6 py-2.5 mt-6 hover:bg-green-50 transition-colors inline-block"
              >
                เริ่มใช้งาน
              </button>
            </div>

            {/* Card B — GitHub */}
            <div className="bg-gray-800 rounded-3xl p-8 text-white">
              <div className="mb-3">
                <span className="material-symbols-outlined text-[40px]">code</span>
              </div>
              <h3 className="text-2xl font-black">Source Code</h3>
              <p className="text-gray-400 text-sm mt-1">ดู code ทั้งหมดของโปรเจคได้ที่ GitHub</p>
              <button
                onClick={() =>
                  window.open('https://github.com/fuzenblue/Phak-Chat-Jen.git', '_blank')
                }
                className="bg-white text-gray-800 font-bold rounded-2xl px-6 py-2.5 mt-6 hover:bg-gray-100 transition-colors inline-block"
              >
                ดู Repository
              </button>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                name: 'Amornthida Butwong',
                initial: 'A',
                responsibility: 'system setup, frontend customer part, backend store/map/agent features, integration',
                email: 'amornthida.butwong@g.swu.ac.th',
              },
              {
                name: 'Piyathida Maha',
                initial: 'P',
                responsibility: 'product flow, data/schema design, frontend seller part, backend auth/core logic, source analysis',
                email: 'piyathida.maha@g.swu.ac.th',
              },
            ].map(({ name, initial, responsibility, email }) => (
              <div
                key={name}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-xl font-bold">
                  {initial}
                </div>
                <p className="font-bold text-gray-800 text-lg mt-3">{name}</p>
                <p className="text-sm text-gray-400">{responsibility}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">mail</span>
                  {email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-gray-900 text-white py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400">eco</span>
              <span className="text-xl font-bold">ผักชัดเจน</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">แพลตฟอร์มผักสดอัจฉริยะ</p>
            <p className="text-gray-500 text-xs mt-1">Final Project · 2026</p>
          </div>

          {/* Middle */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Links</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/map')}
                className="text-sm text-gray-300 hover:text-white text-left transition-colors"
              >
                ลองใช้งาน Demo
              </button>
              <button
                onClick={() => window.open('https://github.com/PLACEHOLDER_REPO', '_blank')}
                className="text-sm text-gray-300 hover:text-white text-left transition-colors"
              >
                Source Code
              </button>
              <button
                onClick={() =>
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-sm text-gray-300 hover:text-white text-left transition-colors"
              >
                เกี่ยวกับโปรเจค
              </button>
            </div>
          </div>

          {/* Right */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {[
                'React',
                'Node.js',
                'PostgreSQL',
                'PostGIS',
                'Qwen VL',
                'Cloudinary',
                'Google Maps',
                'Tailwind CSS',
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs">
          © 2026 ผักชัดเจน · Final Project · Srinakharinwirot University
        </div>
      </footer>
    </div>
  );
}
