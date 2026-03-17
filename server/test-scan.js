// run: node test-scan.js
import "dotenv/config";

// test image
const TEST_IMAGE_URL = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800";
const VEG_TYPE = "ผักสลัด";

async function scanVegetable(imageUrl, vegType) {
  const prompt = `
คุณเป็นผู้เชี่ยวชาญด้านการประเมินความสดของผักสด
ดูรูปภาพ ${vegType} นี้แล้วตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอกจาก JSON

{
  "freshness_score": <ตัวเลข 0.0 ถึง 1.0 โดย 1.0 = สดมาก, 0.0 = เน่าเสีย>,
  "freshness_label": <"สด" หรือ "พอใช้" หรือ "ใกล้เสีย">,
  "summary": <อธิบายสภาพผักใน 1-2 ประโยคภาษาไทย>,
  "price_multiplier": <ตัวเลข 0.5 ถึง 1.0 คูณกับราคาตั้งต้นเพื่อได้ราคาแนะนำ>
}
  `.trim();

  const response = await fetch(
    "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-vl-max",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  // if api return error
  if (data.error) {
    console.error("API Error:", data.error);
    return;
  }

  const raw = data.choices[0].message.content;
  console.log("\n--- Raw output จาก AI ---");
  console.log(raw);

  // remove ```json ... ``` if ai return it
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    console.log("\n--- Parsed JSON ---");
    console.log(parsed);

    // calculate price
    const originalPrice = 30;
    const recommendedPrice = Math.round(originalPrice * parsed.price_multiplier);
    console.log(`\nราคาแนะนำ (ตั้งต้น ${originalPrice} บาท): ${recommendedPrice} บาท`);
  } catch (e) {
    console.error("\nparse JSON ไม่ได้ — AI ตอบมาผิด format");
    console.error("ควรแก้ prompt ให้เข้มงวดขึ้น");
  }
}

scanVegetable(TEST_IMAGE_URL, VEG_TYPE);