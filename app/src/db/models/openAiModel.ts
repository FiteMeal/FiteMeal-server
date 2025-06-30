import openai from "@/lib/openai";
import { FormPrep } from "@/app/interfaces/prepMeal";
import { ObjectId } from "mongodb";
import PlansData from "./Plans";

export default class OpenAi {
 

  // Helper function to calculate BMR and daily calories
  static calculateDailyCalories(payload: FormPrep) {
    // Calculate BMR based on gender
    let bmr: number;
    if (payload.gender.toLowerCase() === "pria") {
      bmr = 66 + 13.7 * payload.weight + 5 * payload.height - 6.8 * payload.age;
    } else {
      bmr =
        655 + 9.6 * payload.weight + 1.8 * payload.height - 4.7 * payload.age;
    }

    const activityFactors: { [key: string]: number } = {
      "Inactive": 1.2,
      "Somewhat Active": 1.375,
      "Active": 1.375,
      "Very Active": 1.55
    };

    const activityFactor =
      activityFactors[payload.activity_level.toLowerCase()];


    const dailyCalories = Math.round(bmr * activityFactor);

    return dailyCalories;
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
                - "dailyCalories": ${this.calculateDailyCalories}
                - "breakfast":
                    - "name"
                    - "imageUrl": Kosong atau placeholder
                    - "calories": Sekitar 25% dari dailyCalories
                    - "ingredients": Array bahan
                    - "recipes": Array langkah masak
                    - "isDone" : false
                    - "notes" : ""
                - "lunch": *(Harus juga punya ingredients dan recipes)* *Calories Sekitar 35% dari dailyCalories*
                - "dinner": *(Harus juga punya ingredients dan recipes)* *Calories Sekitar 40% dari dailyCalories*

                Rules tambahan:
                - Semua menu adalah masakan Indonesia.
                - Menu setiap hari harus beda.
                - Lunch dan Dinner harus sama lengkapnya seperti Breakfast (ada ingredients dan recipes).
                - Jangan ada narasi, output hanya JSON seperti ini :
                    
                    {
                        name:${payload.name},
                        userId: ${payload.userId},
                        startDate : ${payload.startDate}
                        todoList:[output disini]
                    }  `,
    });

    console.log(response.output_text);
    const trim = response.output_text.replace(/```json/, "").replace(/```/, "");

    const hasil = JSON.parse(trim);
    hasil.todoList = hasil.todoList.map((el:unknown) =>{
      el.date = new Date(el.date)
      return el
    })
    hasil.userId = new ObjectId(payload.userId);
    hasil.startDate = new Date(payload.startDate)
    console.log(typeof hasil, "ini tipe data <<<<<");
    await PlansData.insert(hasil)
    return hasil;
  }
}
