import { IUsers } from "@/app/interfaces/users";
import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
const userSchema = z.object({
  email: z.string().email("Email must be in correct format"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
      "Password must contain both letters and numbers"
    ),
  gender: z.string().min(1, "You must fill out your gender"),
  dateOfBirth: z.string().min(1, "You must fill out your birth date")
});


export async function POST(req: Request) {
    try {
        const body: IUsers = await req.json()
         userSchema.parse(body);

         
        
            const user = await User.where('email',body.email).first();
            if (user) {
              throw new CustomError("Account already registered", 400);
            }
        
            const userByUsername = await User.where('username',body.username).first();
            if (userByUsername) {
              throw new CustomError("Account already registered", 400);
            }
        
            body.password = bcrypt.hashSync(body.password, 10);
            await User.insert({...body, height: 0, weight: 0, activityLevel: "active", isPremium: false});
        return Response.json({message:"Registration successful!"}, {status: 201})
    } catch (error) {
      console.log(error);
      
        const {message, status} = errorHandler(error)
        return Response.json({message}, {status})
    }
}