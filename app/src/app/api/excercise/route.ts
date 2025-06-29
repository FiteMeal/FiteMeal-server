import { CustomError } from "@/db/helpers/CustomError";
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
