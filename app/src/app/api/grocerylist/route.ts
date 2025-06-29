import { CustomError } from "@/db/helpers/CustomError";
import AlternativeMeal from "@/db/models/alternativeMeal";
import PlansData from "@/db/models/Plans";
import genereateAlternativeMeals from "@/services/generateGroceryList";

export async function POST(req: Request) {
  const userEmail = req.headers.get("x-user-email");

  if (!userEmail) {
    throw new CustomError(`Unauthorized! Please login first!`, 401);
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    throw new CustomError("Plan ID is required", 400);
  }
  
  const data = await PlansData.where('_id', id).get();
  console.log(data, "ini data ");

  const resp = await genereateAlternativeMeals(data);

  const result = await AlternativeMeal.insert(resp);

  return Response.json({ result }, { status: 201 });
}