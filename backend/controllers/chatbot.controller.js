// backend/controllers/chatbot.controller.js

import aiModels from "../geminiAI.js";
import Product from "../models/product.model.js";

export const handleChatbotRequest = async (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery) {
    return res
      .status(400)
      .json({ message: "So'rov matni bo'sh bo'lishi mumkin emas." });
  }

  try {
    let relevantProducts = await Product.findRelevantAI(userQuery);

    if (!relevantProducts || relevantProducts.length === 0) {
      return res.status(404).json({
        message:
          "Kechirasiz, siz so‘ragan mahsulot bizning do‘konimizda hozircha mavjud emas.",
        tip: "Iltimos, boshqa nom bilan urinib ko‘ring yoki quyidagi mashhur mahsulotlardan tanlashingiz mumkin.",
        suggestions: await Product.find().sort({ rating: -1 }).limit(5), 
      });
    }

    const productListText = relevantProducts
      .map((product) => {
        return `[PRODUCT]
ID: ${product._id}
Nomi: ${product.name}
Tavsif: ${product.description}
Narxi: ${product.price} so'm
Rasm: ${product.image}
[/PRODUCT]`;
      })
      .join("\n");

    const prompt = `
Siz aqlli elektron tijorat yordamchisiz va do'konimizdagi haqiqiy mahsulotlarni chuqur bilasiz.
Foydalanuvchi so'rovi: "${userQuery}"

Quyida do'konimizdagi mahsulotlar ro'yxati keltirilgan. Javobingizda FaqAT ro'yxatda mavjud mahsulotlardan foydalaning va haqiqiy mahsulot ma'lumotlariga asoslangan tavsiya matnini yozing.

Mahsulotlar:
${productListText}

Iltimos, javobingizni quyidagi formatda JSON shaklida yozing:
{
  "intro": "Kirish qismini (masalan, mahsulotlar haqida qisqacha umumiy tavsif) yozing.",
  "recommendedProducts": [
      {
          "id": "mahsulotning IDsi",
          "name": "mahsulot nomi",
          "price": "mahsulot narxi",
          "description": "mahsulot tavsifi",
          "image": "mahsulot rasmi",
          "recommendation": "AI tomonidan yozilgan tavsiya matni"
      },
      ...
  ]
}
  Iltimos, javobni oddiy JSON formatida qaytaring. Hech qanday json yoki code block ishlatmang.

Faqat markerlar bilan berilgan mahsulotlar asosida haqiqatga mos javob qaytaring va ortiqcha gaplardan saqlaning.
    `;

    const result = await aiModels.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });
    let aiResponseText = await result.text;
    if (aiResponseText.startsWith("```json")) {
      aiResponseText = aiResponseText
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
    }

    let output;
    try {
      output = JSON.parse(aiResponseText);
      res.json(output);
    } catch (parseError) {
      console.error("JSON parse xatosi:", parseError);
      console.error("AI dan kelgan matn:", aiResponseText);
      res.status(500).json({
        message: "AI javobini JSON formatida o'qib bo'lmadi.",
        error: parseError.message,
        rawResponse: aiResponseText,
      });
    }
  } catch (error) {
    console.error("Chatbot yoki AI xatoligi:", error);
    res
      .status(500)
      .json({ message: "Yordam bera olmayman.", error: error.message });
  }
};

