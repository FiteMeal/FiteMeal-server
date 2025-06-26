import { ILogin } from "@/app/interfaces/users";
import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email must be in correct format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body:ILogin = await req.json();
    loginSchema.parse(body);

    const user = await User.where('email', body.email).first();
    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    const isPasswordValid = bcrypt.compareSync(body.password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        username: user.username 
      },
      process.env.JWT as string,
      { expiresIn: "7d" }
    );

    return Response.json(
      { 
        message: "Login successful", 
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      }, 
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = errorHandler(error);
    console.log(error);
    
    return Response.json({ message }, { status });
  }
}

