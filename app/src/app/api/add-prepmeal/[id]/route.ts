import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import PlansData from "@/db/models/Plans";

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

    const userId = req.headers.get("x-user-id")
    console.log(userId, "ini user id <<<");
    

    const { id } = await params;

    if (!id) {
      throw new CustomError("Prep meal ID is required", 400);
    }

    const prepMeal = await PlansData.where('_id',id).get();

    if (!prepMeal) {
      throw new CustomError("Prep meal not found", 404);
    }

    return Response.json(prepMeal, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}