// import { RecipeFromModel } from "@/app/interfaces/prepMeal";
// import PlansData from "@/db/models/Plans";
// import openai from "@/lib/openai";

// export default async function generateByPhoto (payload:RecipeFromModel){

//     console.log(payload,'ini payload ');
//     const data = await PlansData.where('_id',payload.plansId).first()

//         console.log(data?.todoList,'ini todolist');
//     const response = await openai.responses.create({
//         model:'gpt-4.1',
//         input:`Berdasarkan todolist : ${data?.todoList} saya tidak bisa membeli atau menemukan bahan-bahan yang ada pada data,
//             saya hanya memiliki bahan yang ada didalam foto ini : ${payload.photoUrl}, berikan response dengan format dan data yang sama seperti todolist yang saya berikan.
            
//             Berikan response seperti ini :
//             {
//             notes:jabarkan bahan-bahan apa saja yang ada pada photo dengan benar dan detail,
//             userId:${payload.userId},
//             plansId:${payload.plansId},
//             photoUrl:${payload.photoUrl}
//             todoList : [output disini]
//             }
//             `
//     })
//     const trim = response.output_text.replace(/```json/, "").replace(/```/, "");
//     const hasil = JSON.parse(trim)
//     hasil.userId = new Object(payload.userId)
//     hasil.plansId = new Object(payload.plansId)

//     console.log(hasil,'ini hasil');

//     return hasil
    
    
    
// }

// // todoList :
// //             - "day": Nomor hari (1-X)
// //             - "date" : //hari pertama atau start date sesuai start date , begitu seterusnya dengan format YYYY-MM-DD atau format seperti new Date ()
// //             - "dailycalories": Total kalori yang ada di todolist.
// //             - "breakfast":
// //                     - "name"
// //                     - "imageUrl": ""
// //                     - "calories": total calories dinner harus lebih sedikit dari breakfast dan lunch
// //                     - "ingredients": Array bahan
// //                     - "recipes": Array langkah masak
// //                     - "isDone" : false
// //                     - "notes" : ""
// //             - "lunch": *(Harus juga punya ingredients dan recipes)*
// //             - "dinner": *(Harus juga punya ingredients dan recipes)*

// //            Rules tambahan:
// //                 - Semua menu adalah masakan Indonesia.
// //                 - Menu setiap hari harus beda.
// //                 - Lunch dan Dinner harus sama lengkapnya seperti Breakfast (ada ingredients dan recipes).
// //                 - Jangan ada narasi, output hanya JSON

import { RecipeFromModel } from "@/app/interfaces/prepMeal";
import { extractIngredientsFromImage } from "./analyzedImage";
import generateMealFromIngredients from "./generateMealFromIngredients";

export default async function generateByPhoto(payload: RecipeFromModel) {
  console.log("Payload:", payload);

  const ingredientsText = await extractIngredientsFromImage(payload.photoUrl);
  console.log("Detected ingredients:", ingredientsText);

  const finalMealPlan = await generateMealFromIngredients(payload, ingredientsText);
  console.log("Final meal plan:", finalMealPlan);

  return finalMealPlan;
}
