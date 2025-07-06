import openai from "@/lib/openai";
import PlansData from "@/db/models/Plans";
import { ObjectId } from "mongodb";

export default async function generateMealFromIngredients(payload: {
   userId : ObjectId
    plansId:ObjectId
    photoUrl:string
}, availableIngredients: string) {
  const data = await PlansData.where('_id', payload.plansId).first();
  console.log(data,'ini dataaa nih ');
  console.log(data?.todoList.length,'ini length');
  
  

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: "Kamu adalah ahli gizi yang bisa membuat meal plan harian berdasarkan bahan-bahan yang tersedia."
      },
      {
        role: "user",
        content: `
Saya memiliki rencana makan (todoList) sebagai berikut: ${JSON.stringify(data?.todoList,null,2)}.
Namun saya tidak memiliki semua bahan tersebut.

Saya hanya memiliki bahan-bahan berikut ini: ${availableIngredients}.

Buat ulang meal plan saya (WAJIB dengan format dan struktur yang sama dan untuk ${data?.todoList.length} hari), hanya menggunakan bahan yang saya miliki, dan tetap menjaga total kalori harian ${data?.todoList[0].dailyCalories}.

Detail Format todoList WAJIB seperti ini : 
 {
      day: 1,
      date: ${data?.todoList[0].date},
      dailycalories: ${data?.todoList[0].dailyCalories},
      breakfast: {
        name: nama hidangan,
        imageUrl: "",
        calories : total calories hidangan,
        ingredients:[ingredients hidangan],
        recipes:[cara memasaka hidangan],
        isDone : false,
        notes:""
      },
      lunch: [Object],
      dinner: [Object]
}

Balas hanya dalam format JSON seperti berikut:
{
  "notes": "penjelasan bahan yang terlihat",
  "userId": "${payload.userId}",
  "startDate":${data?.startDate},
  "endDate":${data?.endDate},
  "photoUrl": "${payload.photoUrl}",
  "todoList": [ ...hasil meal plan... ]
}
  JANGAN DITAMBAHKAN NARASI APAPUN (WAJIB)
    `
      }
    ],
    temperature: 0.7,
    max_tokens: 5000
  });

 const raw = response.choices[0].message?.content ?? "";

let trimmed = raw.trim();

// Hapus semua blok code markdown secara menyeluruh
trimmed = trimmed.replace(/```(?:json)?[\s\S]*?```/g, '').trim();

// Cari objek JSON di dalam string
const jsonStart = trimmed.indexOf('{');
const jsonEnd = trimmed.lastIndexOf('}');

if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
  trimmed = trimmed.substring(jsonStart, jsonEnd + 1);
}

console.log('Raw OpenAI response:', raw);
console.log('Trimmed JSON:', trimmed);

let hasil;
try {
  hasil = JSON.parse(trimmed);
} catch (parseError) {
  console.error('JSON Parse Error:', parseError);
  console.error('Failed to parse:', trimmed);
  throw new Error(`Failed to parse OpenAI response as JSON:`);
}



  hasil.userId = new Object(payload.userId);
  console.log(hasil.userId,'ini user id');
  
  hasil.plansId = new Object(payload.plansId);
  console.log(hasil.plansId,"ini plans id");
  

  return hasil;
}
