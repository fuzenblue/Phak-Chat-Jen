// run: node test-scan.js
import "dotenv/config";

// test image
const TEST_IMAGE_URL = "https://plus.unsplash.com/premium_photo-1763058513102-af705972e83c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const VEG_TYPE = "ผักสลัด";

async function scanVegetable(imageUrl, vegType) {
  const prompt = `
You are an expert in evaluating the freshness of vegetables.
Analyze the image of ${vegType} and respond ONLY with a JSON object.
Do not include any text, explanation, or markdown outside the JSON.

{
  "freshness_score": <float 0.0 to 1.0, where 1.0 = very fresh, 0.0 = rotten>,
  "freshness_label": <"สด" or "พอใช้" or "ใกล้เสีย">,
  "summary": <1-2 sentences in Thai describing the vegetable condition>,
  "price_multiplier": <float 0.5 to 1.0 to multiply with the original price>
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