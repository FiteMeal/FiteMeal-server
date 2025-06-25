import { IUsers, ILogin } from "@/app/interfaces/users";
import { getDb } from "../config/mongodb";
import { CustomError } from "../helpers/CustomError";
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

 
}

// buatkan saya menu makanan (nama menu harus benar / tidak general) mealprep untuk 7 hari dan untuk makan sarapan, siang, dan malam sehingga memenuhi kebutuhan kalori harian dengan patokan jatah kalori per hari:
// * usia saya 20 tahun
// * tinggi saya 174cm
// * berat badan saya 58kg,
// * laki laki
// * tingkat aktifitas saya: Somewhat active: Include light activity or moderate activity about two to three times a week.
// * tujuan saya bulking
// * saya alergi seafood

// Ensure the output is a valid JSON array containing 3 menu per day (for breakfast, lunch, and dinner). Do not include any other text outside of this JSON array.
// Example of one exercise object in the array:
// {
//     "calories intake/day": number,
//     "menu": {
//         "name": string
//         "meal type": breakfast/lunch/dinner
//         "calories": number, = total calories from all groceries calories
//         "ingredients": [string],
//         "groceries": {
//             "name": string,
//             "calories": number, = percentage from all calories
//             "measurement": string
//         }
//     }

// }`;
