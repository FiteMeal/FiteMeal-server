import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import generateMealExercisePlan from "@/services/generateMealExercise";
import MealExercisePlan from "@/db/models/MealExercisePlan";

export async function POST(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get('x-user-id');

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const body = await req.json();
    body.userId = userId;
    
    console.log(body, "ini body meal exercise");

    const data = await generateMealExercisePlan(body);
    console.log(data, "ini data meal exercise");

    await MealExercisePlan.insert(data);

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}