import { v2 as cloudinary } from "cloudinary";
import errorHandler from "@/db/helpers/errorHandler";
import generateByPhoto from "@/services/generateRecipeByPhoto";
import UserPhoto from "@/db/models/generateRecipeByPhoto";
import { ObjectId } from "mongodb";
import { CustomError } from "@/db/helpers/CustomError";
import MealByPhoto from "@/db/models/generateMealByPhoto";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get('x-user-id')

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const formData = await req.formData();
    const file = formData.get("photo") as File;
    const plansId = formData.get("plansId") as string;
    console.log(plansId, "ini plans id");

    if (!file) {
      return Response.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload buffer to Cloudinary
    const upload: {secure_url: string} = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "Fite-Meal",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as {secure_url: string});
          }
        )
        .end(buffer);
    }) 

    const payload = {
      plansId: new ObjectId(plansId),
      userId: new ObjectId(userId as string),
      photoUrl: upload.secure_url as string,
    };
    await UserPhoto.insert(payload);
    const generateResponse = await generateByPhoto(payload);
    await MealByPhoto.insert(generateResponse);

    return Response.json({ generateResponse }, { status: 201 });
  } catch (error) {
    console.log(error);
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }

}
export async function GET(req:Request){

  const userId = await req.headers.get('x-user-id')
  const objectId = new ObjectId(userId as string)
  const data =  await MealByPhoto.where('userId',objectId).get()

  console.log(data,'inidata dari get upload');
  

  return Response.json({data},{status:200})
}
