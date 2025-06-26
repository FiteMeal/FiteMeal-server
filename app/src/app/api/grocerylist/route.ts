import { Plans } from "@/app/interfaces/prepMeal";
import AlternativeMeal from "@/db/models/alternativeMeal";
import genereateAlternativeMeals from "@/services/generateGroceryList";
import { ObjectId } from "mongodb";
import { DB } from "mongoloquent";



export async function POST (){

    const data = await DB.collection<Plans>('plans').where('userId','=',new ObjectId('685d3c4afd9e904bd1ac70b7')).get()
    // console.log(data,"ini data ");
    
    const resp = await genereateAlternativeMeals(data)

    const result = await AlternativeMeal.insert(resp)
    
    
    return Response.json({result},{status:201})
}