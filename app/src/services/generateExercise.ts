import { ExercisePlan } from "@/app/interfaces/excercise";
import dayjs from "@/lib/dayjs";
import openai from "@/lib/openai";
import { ObjectId } from "mongodb";

export default async function generateExercise(payload: ExercisePlan) {
  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: `Buatkan data json exercise plan selama ${payload.duration} hari, tapi jangan setiap hari, atur sehingga ada jeda antara latihan (tidak berturut turut).
                - usia saya ${payload.age} tahun
                - tinggi saya ${payload.height}cm
                - berat badan saya ${payload.weight}kg, 
                - ${payload.gender}
                - tujuan saya ${payload.goals}
                - equipment : ${payload.equipment}'

                Detail Format :
                - Struktur data per hari:
                - "day": Nomor hari (1-X)
                - "date" : format YYYY-MM-DD dimulai dari ${payload.startDate}
                - excerciseName : string (untuk exercise dibedakan setiap hari nya)
                - "totalSession": string durasi total latihan (misal: "45 menit") 
                - "caloriesBurned": number estimasi kalori terbakar
                - "sets": jumlah set,
                - "reps": repetisi atau durasi,
                - "targetMuscle": otot yang dilatih,
                - "isDone": false

                Jangan ada narasi , output hanya narasi seperti ini : 
                {
                    name:${payload.name},
                    userId:${payload.userId},
                    startDate: ${payload.startDate},
                    endDate: ${payload.startDate} + ${payload.duration - 1},
                    todoList : [output disini]
                }`,
  });
  console.log(response.output_text);
  const trim = response.output_text.replace(/```json/, "").replace(/```/, "");

  const hasil: ExercisePlan = JSON.parse(trim);
  hasil.todoList = hasil.todoList.map((el) => {
    el.date = new Date(el.date);
    return el;
  });
  hasil.userId = new ObjectId(payload.userId);
  hasil.startDate = dayjs(hasil.startDate).toDate();
  console.log(hasil.startDate,'startdate <<<<');
  
  
  // Calculate endDate: startDate + duration - 1 days
  const endDate = new Date(payload.startDate);
  endDate.setDate(endDate.getDate() + payload.duration - 1);
  hasil.endDate = dayjs(endDate).toDate();
  console.log(dayjs(),'ini dayjs');
  console.log(dayjs().toDate(),"ini dayjs to date ");
  
  
  
  // console.log(typeof hasil, "ini tipe data <<<<<");
  return hasil;
}
