import { IUsers } from "@/app/interfaces/users";
import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import User from "@/db/models/User";
import {z} from "zod";

function calculateAge(dateOfBirthString: string) {
  const today = new Date(); 
  
  const birthDate = new Date(dateOfBirthString);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const patchUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  gender: z.string().min(1, "Gender is required").optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required").optional(),
  height: z.number().min(1, "Height must be greater than 0").optional(),
  weight: z.number().min(1, "Weight must be greater than 0").optional(),
  activityLevel: z.string().min(1, "Activity leve is required").optional()
});

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
      throw new CustomError("User not found", 404);
    }
    console.log(profile);

    const response = {
        id: profile._id,
        name: profile.name,
        username: profile.username,
        email: profile.email,
        gender: profile.gender,
        age: calculateAge(profile.dateOfBirth),
        height: profile.height,
        weight: profile.weight,
        activityLevel: profile.activityLevel,
        isPremium: profile.isPremium
        
    }

    return Response.json( response , { status: 200 });
  } catch (error) {
    console.log();
    
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}

export async function PATCH(req: Request,
    {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
    try {
        const {id} = await params
        const body: IUsers = await req.json()

        patchUserSchema.parse(body)

        const user = await User.where("_id", id).first()
        if (!user) {
            throw new CustomError("User not found", 404)
        }

        await User.where("_id", id).update(body)

        return Response.json({message: "Profile updated successfully!"}, {status: 200})
    } catch (error) {
        console.log(error);
        const {message, status} = errorHandler(error)
        return Response.json({message}, {status})
    }
}