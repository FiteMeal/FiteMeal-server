import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import OpenAi from "@/db/models/openAiModel";
import PlansData from "@/db/models/Plans";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const userEmail = req.headers.get("x-user-email");
  const userId = req.headers.get("x-user-id");
  console.log(req.headers,'ini headers dari add meal ')

  if (!userEmail) {
    throw new CustomError(`Unauthorized! Please login first!`, 401);
  }

  const body = await req.json();
  body.userId = userId
  console.log(body,'ini body');

  const resp = await OpenAi.generatePrepMeal(body);

  return Response.json({ resp }, { status: 201 });
}

export async function GET(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const userId = req.headers.get("x-user-id");
    console.log(userId, "ini user id <<<");
    
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    // Convert string userId to ObjectId untuk match dengan database
    const userObjectId = new ObjectId(userId);
    
    // Gunakan .get() untuk mendapatkan semua data, bukan .first()
    const prepMeals = await PlansData.where('userId', userObjectId).get();

    if (!prepMeals || prepMeals.length === 0) {
      return Response.json({ message: "No prep meals found", data: [] }, { status: 200 });
    }

    return Response.json({ data: prepMeals }, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}