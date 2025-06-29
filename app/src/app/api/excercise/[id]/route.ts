import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import dataExcercise from "@/db/models/dataExcercise";

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
      throw new CustomError("Exercise ID is required", 400);
    }

    const exercise = await dataExcercise.where('_id', id).first();
    console.log(exercise,'ini exer');
    

    if (!exercise) {
      throw new CustomError("Exercise not found", 404);
    }

    return Response.json(exercise, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}