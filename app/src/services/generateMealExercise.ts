import { MealExercise } from "@/app/interfaces/mealExercise";
import openai from "@/lib/openai";
import { ObjectId } from "mongodb";

function calculateDailyCalories(payload: MealExercise) {
  // Calculate BMR based on gender
  let bmr: number;
  if (payload.gender.toLowerCase() === "pria") {
    bmr = 66 + 13.7 * payload.weight + 5 * payload.height - 6.8 * payload.age;
  } else {
    bmr = 655 + 9.6 * payload.weight + 1.8 * payload.height - 4.7 * payload.age;
  }

  const activityFactors: { [key: string]: number } = {
    inactive: 1.2,
    "somewhat active": 1.375,
    active: 1.375,
    "very active": 1.55,
  };

  const activityFactor = activityFactors[payload.activity_level.toLowerCase()];

  const dailyCalories = Math.round(bmr * activityFactor);

  console.log(
    `BMR: ${bmr}, Activity Factor: ${activityFactor}, Daily Calories: ${dailyCalories}`
  );

  return dailyCalories;
}

export default async function generaterMealExercisePlan(payload: MealExercise) {
  try {
    const dailyCalories = calculateDailyCalories(payload);

    const resp = await openai.responses.create({
      model: "gpt-4.1",
      input: `Buatkan data JSON meal plan DAN exercise plan sekaligus selama ${payload.duration} hari.
                      - usia saya ${payload.age} tahun
                      - tinggi saya ${payload.height}cm
                      - berat badan saya ${payload.weight}kg
                      - ${payload.gender}
                      - tingkat aktifitas saya: ${payload.activity_level}
                      - tujuan saya ${payload.goals}
                      - preferences makanan: ${payload.preferences}
                      - equipment tersedia: ${payload.equipment}
                      - Target kalori harian: ${dailyCalories} kalori
      
                      Detail Format:
                      - Format: JSON, tidak perlu penjelasan tambahan.
                      - Struktur data per hari:
                      - "day": Nomor hari (1-${payload.duration})
                      - "date": format YYYY-MM-DD dimulai dari ${payload.startDate}
                      - "dailyCalories": ${dailyCalories}
                      - "breakfast":
                          - "name": nama hidangan Indonesia
                          - "imageUrl": ""
                          - "calories": sekitar 25% dari dailyCalories
                          - "ingredients": Array bahan
                          - "recipes": Array langkah masak
                          - "isDone": false
                          - "notes": ""
                      - "lunch": *(Harus juga punya ingredients dan recipes)* *Calories Sekitar 35% dari dailyCalories*
                      - "dinner": *(Harus juga punya ingredients dan recipes)* *Calories Sekitar 40% dari dailyCalories*
                      - "exercise":
                          - "exerciseName": nama program latihan hari ini
                          - "totalSession": durasi total latihan (misal: "45 menit")
                          - "exercises": [
                              {
                                  "name": nama latihan spesifik,
                                  "sets": jumlah set,
                                  "reps": repetisi atau durasi,
                                  "targetMuscle": otot yang dilatih,
                                  "equipment": alat yang digunakan
                              }
                          ]
                          - "caloriesBurned": estimasi kalori terbakar
                          - "notes": tips atau catatan
                          - "isDone": false
      
                      Rules tambahan:
                      - Semua menu makanan adalah masakan Indonesia
                      - Menu setiap hari harus berbeda
                      - Exercise plan disesuaikan dengan equipment yang tersedia: ${payload.equipment}
                      - Exercise berbeda setiap hari (cardio, strength, flexibility, dll)
                      - Total kalori makanan harus mendekati ${dailyCalories}
                      - Exercise plan harus mendukung goal: ${payload.goals}
      
                      Output HANYA JSON seperti ini:
                      {
                          "name": "${payload.name}",
                          "userId": "${payload.userId}",
                          "startDate": "${payload.startDate}",
                          "endDate": "${payload.startDate} + ${payload.duration - 1}",
                          "dailyCalories": ${dailyCalories},
                          "duration": ${payload.duration},
                          "goal": "${payload.goals}",
                          "todoList": [output ${payload.duration} hari disini]
                      }`,
    });

    console.log(resp.output_text);
    const trim = resp.output_text.replace(/```json/, "").replace(/```/, "");

    const hasil = JSON.parse(trim);
    hasil.startDate = new Date(hasil.startDate)
    hasil.userId = new ObjectId(payload.userId);
    hasil.dailyCalories = dailyCalories;
    
    // Calculate endDate: startDate + duration - 1 days
    const endDate = new Date(payload.startDate);
    endDate.setDate(endDate.getDate() + payload.duration - 1);
    hasil.endDate = endDate;
    
    console.log(typeof hasil, "ini tipe data <<<<<");
    return hasil;
  } catch (error) {
    console.log("Error in generateMealExercisePlan:", error);
  }
}
