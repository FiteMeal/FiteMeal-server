import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import AlternativeMeal from "@/db/models/alternativeMeal";
import PlansData from "@/db/models/Plans";
import genereateAlternativeMeals from "@/services/generateGroceryList";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const userEmail = req.headers.get("x-user-email");

  if (!userEmail) {
    throw new CustomError(`Unauthorized! Please login first!`, 401);
  }

  const body = await req.json();
  const { planId } = body;

  if (!planId) {
    throw new CustomError("Plan ID is required", 400);
  }
  const objectId = new ObjectId(planId)
  
  const data = await PlansData.where('userId', objectId).get();
  console.log(data, "ini data ");

  const resp = await genereateAlternativeMeals(data);

  const result = await AlternativeMeal.insert(resp);

  return Response.json({ result }, { status: 201 });
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
    console.log(userId,'dari grocerylist get');
    


    
    const userObjectId = new ObjectId(userId);

    const groceryList = await AlternativeMeal.where('userId', userObjectId).get();

    if (!groceryList) {
      throw new CustomError("Grocery list not found", 404);
    }

    return Response.json(groceryList, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}