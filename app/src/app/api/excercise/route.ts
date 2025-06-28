import dataExcercise from "@/db/models/dataExcercise";
import generateExercise from "@/services/generateExercise";

export async function POST(req:Request){

    const body = await req.json()
    const data = await generateExercise(body)
    console.log(data,'ini data');
    console.log(body,'ini body');
    
    
    await dataExcercise.insert(data)
  
    return Response.json({data},{status:201})
}