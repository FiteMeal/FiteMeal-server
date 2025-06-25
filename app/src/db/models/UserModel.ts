import { IUsers, ILogin } from "@/app/interfaces/users";
import { getDb } from "../config/mongodb";
import { CustomError } from "../helpers/CustomError";
import bcrypt from "bcryptjs";
import { z } from "zod";
import * as jose from "jose";

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
});

export default class UserModel {
  static getCollection() {
    return getDb().collection<IUsers>("users");
  }

  static async register(payload: IUsers) {
    userSchema.parse(payload);

    const collection = this.getCollection();
    const user = await collection.findOne({ email: payload.username });
    if (user) {
      throw new CustomError("Account already registered", 400);
    }

    const userByUsername = await collection.findOne({
      username: payload.username,
    });
    if (userByUsername) {
      throw new CustomError("Account already registered", 400);
    }

    payload.password = bcrypt.hashSync(payload.password, 10);
    await collection.insertOne(payload);

    return "User registered";
  }

  static async login(payload: ILogin) {
    const collection = this.getCollection();
    const { email, password } = payload;
    if (!email) {
      throw new CustomError("Email cant be empty", 400);
    }

    if (!password) {
      throw new CustomError("Password cant be empty");
    }

    const user = await collection.findOne({ email });

    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    const passwordCheck = bcrypt.compareSync(password, user.password);

    if (!passwordCheck) {
      throw new CustomError("Invalid email or password", 401);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    try {
      const token = await new jose.SignJWT({
        _id: user._id,
        username: user.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      return {
        message: "Login successful",
        token: token,
      };
    } catch (error) {
      console.log(error);
      throw new CustomError(`Failed to generate token - ${error}`, 500);
    }
  }
}
