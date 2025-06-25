import openai from "@/lib/openai";
import { getDb } from "../config/mongodb";

interface IPlans {
  _id: string;
  name: string;
  plans: IDetail[];
}

interface IDetail {
  day: string;
  dailycalories: number;
}
interface IBreakfast {
  name: string;
  imageUrl: string;
  calories: number;
  ingredients: string[];
  recipes: string[];
}

interface ILunch {
  name: string;
  imageUrl: string;
  calories: number;
  ingredients: string[];
  recipes: string[];
}
interface IDinner {
  name: string;
  imageUrl: string;
  calories: number;
  ingredients: string[];
  recipes: string[];
}
export default class OpenAi {
  static async getCollection() {
    return getDb().collection("plans");
  }
  static async generatePrepMeal() {
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: `Tolong buatkan data JSON meal plan selama 3 hari (3/5/7 hari).  
                - usia saya 20 tahun
                - tinggi saya 174cm
                - berat badan saya 58kg, 
                - laki laki
                - tingkat aktifitas saya: Somewhat active: Include light activity or moderate activity about two to three times a week.
                - tujuan saya bulking
                - saya alergi seafood
                Detail format:

                - Format: JSON, tidak perlu penjelasan tambahan.
                - Struktur data per hari:
                - "day": Nomor hari (1-X)
                - "dailycalories": Total 1500 kcal.
                - "breakfast":
                    - "name"
                    - "imageUrl": Kosong atau placeholder
                    - "calories": Sekitar 500
                    - "ingredients": Array bahan
                    - "recipes": Array langkah masak
                - "lunch": *(Harus juga punya ingredients dan recipes)*
                - "dinner": *(Harus juga punya ingredients dan recipes)*

                Rules tambahan:
                - Semua menu adalah masakan Indonesia.
                - Menu setiap hari harus beda.
                - Lunch dan Dinner harus sama lengkapnya seperti Breakfast (ada ingredients dan recipes).
                - Jangan ada narasi, output hanya JSON seperti ini :
                    [
                    {
                        name:"Foolan byin foolan",
                        userId: new ObjectId('123456789'),
                        plans:[output disini]
                    }  ]`,
    });

    console.log(response.output_text);
    const hasil = JSON.parse(response.output_text);
    console.log(typeof hasil, "ini tipe data <<<<<");
    const collection = await this.getCollection()
    await collection.insertOne(hasil)
    return hasil

  }
}
