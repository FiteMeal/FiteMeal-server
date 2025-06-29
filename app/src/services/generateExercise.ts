import { ExercisePlan } from "@/app/interfaces/excercise";
import openai from "@/lib/openai";
import { ObjectId } from "mongodb";

export default async function generateExercise(payload: ExercisePlan) {
  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: `Buatkan data json excercise plan selama ${payload.duration} hari per minggu.
                - usia saya ${payload.age} tahun
                - tinggi saya ${payload.height}cm
                - berat badan saya ${payload.weight}kg, 
                - ${payload.gender}
                - tujuan saya ${payload.goals}
                - equipment : ${payload.equipment}'

                Detail Format :
                - Struktur data per hari:
                - "day": Nomor hari (1-X)
                - "date" : //hari pertama atau start date sesuai start date , begitu seterusnya dengan format YYYY-MM-DD atau format seperti new Date ()
                - excerciseName : string (untuk exercise dibedakan setiap hari nya)
                - "totalSession": string durasi total latihan (misal: "45 menit") 
                - "caloriesBurned": number estimasi kalori terbakar
                - "sets": jumlah set,
                - "reps": repetisi atau durasi,
                - "targetMuscle": otot yang dilatih,

                Jangan ada narasi , output hanya narasi seperti ini : 
                {
                    name:${payload.name},
                    userId:${payload.userId},
                    startDate: ${payload.startDate},
                    todoList : [output disini]
                }`,
  });
  console.log(response.output_text);
  const trim = response.output_text.replace(/```json/, "").replace(/```/, "");

  const hasil = JSON.parse(trim);
  hasil.userId = new ObjectId(payload.userId);
  console.log(typeof hasil, "ini tipe data <<<<<");
  return hasil;
}
