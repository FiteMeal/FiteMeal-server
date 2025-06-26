import { ILogin } from "@/app/interfaces/users";
import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import * as jose from "jose";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body: ILogin = await req.json();
    loginSchema.parse(body);

    const user = await User.where("email", body.email).first();
    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    const isPasswordValid = bcrypt.compareSync(body.password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Invalid email or password", 401);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    try {
      const token = await new jose.SignJWT({
        id: user._id,
        email: user.email,
        username: user.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      return Response.json(
        {
          message: "Login successful",
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      throw new CustomError(`Failed to generate token - ${error}`, 500);
    }

  } catch (error) {
    const { message, status } = errorHandler(error);
  
    return Response.json({ message }, { status });
  }
}

// const token = jwt.sign(
//   {
//     id: user._id,
//     email: user.email,
//     username: user.username
//   },
//   process.env.JWT as string,
//   { expiresIn: "7d" }
// );

// return Response.json(
//   {
//     message: "Login successful",
//     token,
//     user: {
//       id: user._id,
//       email: user.email,
//       username: user.username,
//     },
//   },
//   { status: 200 }
// );