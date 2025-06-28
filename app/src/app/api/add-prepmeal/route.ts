import { CustomError } from "@/db/helpers/CustomError";
import OpenAi from "@/db/models/openAiModel";

export async function POST(req: Request) {
  const userEmail = req.headers.get("x-user-email");

  if (!userEmail) {
    throw new CustomError(`Unauthorized! Please login first!`, 401);
  }

  const body = await req.json();

  const resp = await OpenAi.generatePrepMeal(body);

  return Response.json({ resp }, { status: 201 });
}
