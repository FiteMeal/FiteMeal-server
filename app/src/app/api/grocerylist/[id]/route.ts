import { CustomError } from "@/db/helpers/CustomError";
import AlternativeMeal from "@/db/models/alternativeMeal";
import errorHandler from "@/db/helpers/errorHandler";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;

  }
) {
  try {
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const { id } = await params;

    if (!id) {
      throw new CustomError("Grocery list ID is required", 400);
    }

    const groceryList = await AlternativeMeal.where('_id', id).first();

    if (!groceryList) {
      throw new CustomError("Grocery list not found", 404);
    }

    return Response.json(groceryList, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}