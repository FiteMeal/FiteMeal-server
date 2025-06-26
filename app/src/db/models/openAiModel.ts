import openai from "@/lib/openai";
import { getDb } from "../config/mongodb";
import { FormPrep } from "@/app/interfaces/prepMeal";
import { ObjectId } from "mongodb";

export default class OpenAi {
  static async getCollection() {
    return getDb().collection("plans");
  }
  static async generatePrepMeal(payload: FormPrep) {
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: `Tolong buatkan data JSON meal plan selama ${payload.duration} hari (3/5/7 hari).  
                - usia saya ${payload.age} tahun
                - tinggi saya ${payload.height}cm
                - berat badan saya ${payload.weight}kg, 
                - ${payload.gender}
                - tingkat aktifitas saya: ${payload.activity_level}.
                - tujuan saya ${payload.goals}
                - preferences : ${payload.preferences}
                Detail format:

                - Format: JSON, tidak perlu penjelasan tambahan.
                - Struktur data per hari:
                - "day": Nomor hari (1-X)
                - "date" : //hari pertama atau start date sesuai start date , begitu seterusnya dengan format YYYY-MM-DD atau format seperti new Date ()
                - "dailycalories": Total 1500 kcal.
                - "breakfast":
                    - "name"
                    - "imageUrl": Kosong atau placeholder
                    - "calories": Sekitar 500
                    - "ingredients": Array bahan
                    - "recipes": Array langkah masak
                    - "isDone" : false
                    - "notes" : ""
                - "lunch": *(Harus juga punya ingredients dan recipes)*
                - "dinner": *(Harus juga punya ingredients dan recipes)*

                Rules tambahan:
                - Semua menu adalah masakan Indonesia.
                - Menu setiap hari harus beda.
                - Lunch dan Dinner harus sama lengkapnya seperti Breakfast (ada ingredients dan recipes).
                - Jangan ada narasi, output hanya JSON seperti ini :
                    
                    {
                        name:${payload.name},
                        userId: ${new ObjectId(payload.userId)},
                        startDate : ${payload.startDate}
                        plans:[output disini]
                    }  `,
    });

    console.log(response.output_text);
    const trim = response.output_text.replace(/```json/, "").replace(/```/, "");

    const hasil = JSON.parse(trim);
    hasil.userId = new ObjectId(payload.userId)
    console.log(typeof hasil, "ini tipe data <<<<<");
    const collection = await this.getCollection();
    await collection.insertOne(hasil);
    return hasil;
  }
}
