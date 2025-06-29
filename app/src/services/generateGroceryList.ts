import { Plans } from "@/app/interfaces/prepMeal";
import openai from "@/lib/openai";
import { ObjectId } from "mongodb";

export default async function genereateAlternativeMeals(payload:Plans[]) {

    const [{todoList,_id,startDate,name,userId}] = payload

    const response = await openai.responses.create({
        model:'gpt-4.1',
        input:`Buatkan saya alternative meal yang mudah didapatkan di indonesia  dari list mealprep plan dibawah ini : ${JSON.stringify(todoList)} 
            kembalikan hanya dalam bentuk .json tanpa ada kata-kata yang lain, output hanya json seperti ini : 
            {
            userId:${new ObjectId(userId)},
            plansId:${new ObjectId(_id)}
            name:${name},
            startDate:${startDate},
            todoList:[output disini]
            }`
           
   
        
        })
    const trim = response.output_text.replace(/```json/, "").replace(/```/, "");
    const hasil = JSON.parse(trim)
    hasil.userId = new ObjectId(_id)

        console.log(_id,'ini id');
        
        console.log(todoList,'imi todo');
        return hasil
    
    
}