import OpenAi from "@/db/models/openAiModel"

export async function POST (req:Request){

    const body = await req.json()

    const resp = await OpenAi.generatePrepMeal(body)

    return Response.json({resp},{status:201})
}