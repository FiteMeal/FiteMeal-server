import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import User from "@/db/models/User";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const profile = await User.where("_id", id).first();
    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }
    console.log(profile);

    return Response.json({ profile }, { status: 200 });
  } catch (error) {
    console.log(error);
    const { message, status } = errorHandler(error);

    return Response.json({ message }, { status });
  }
}
