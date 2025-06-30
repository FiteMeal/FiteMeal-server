import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import dataExcercise from "@/db/models/dataExcercise";
import generateExercise from "@/services/generateExercise";

export async function POST(req: Request) {
  const userEmail = req.headers.get("x-user-email");
  const userId = req.headers.get('x-user-id')

  if (!userEmail) {
    throw new CustomError(`Unauthorized! Please login first!`, 401);
  }

  const body = await req.json();
  body.userId = userId
  const data = await generateExercise(body);
  console.log(data, "ini data");
  console.log(body, "ini body");

  await dataExcercise.insert(data);

  return Response.json({ data }, { status: 201 });
}
export async function GET(
  req: Request
) {
  try {
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }
    const userId = req.headers.get("x-user-id");


    if (userId) {
      throw new CustomError("Grocery list ID is required", 400);
    }

    const groceryList = await dataExcercise.where('userId', userId).first();

    if (!groceryList) {
      throw new CustomError("Grocery list not found", 404);
    }

    return Response.json(groceryList, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}
