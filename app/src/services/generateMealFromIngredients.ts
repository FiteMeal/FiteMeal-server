import openai from "@/lib/openai";
import { RecipeFromModel } from "@/app/interfaces/prepMeal";
import PlansData from "@/db/models/Plans";

export default async function generateMealFromIngredients(payload: RecipeFromModel, availableIngredients: string) {
  const data = await PlansData.where('_id', payload.plansId).first();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Kamu adalah ahli gizi yang bisa membuat meal plan harian berdasarkan bahan-bahan yang tersedia."
      },
      {
        role: "user",
        content: `
Saya memiliki rencana makan (todoList) sebagai berikut: ${JSON.stringify(data?.todoList)}.
Namun saya tidak memiliki semua bahan tersebut.

Saya hanya memiliki bahan-bahan berikut ini: ${availableIngredients}.

Buat ulang meal plan saya (dengan format dan struktur yang sama), hanya menggunakan bahan yang saya miliki, dan tetap menjaga total kalori harian sekitar 1500 kcal/hari.

Balas dalam format JSON:
{
  "notes": "penjelasan bahan yang terlihat",
  "userId": "${payload.userId}",
  "plansId": "${payload.plansId}",
  "photoUrl": "${payload.photoUrl}",
  "todoList": [ ...hasil meal plan... ]
}
        `
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  const raw = response.choices[0].message?.content ?? "";
  const trimmed = raw.replace(/```json/, "").replace(/```/, "");
  const hasil = JSON.parse(trimmed);

  hasil.userId = new Object(payload.userId);
  hasil.plansId = new Object(payload.plansId);

  return hasil;
}
