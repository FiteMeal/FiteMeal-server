import { v2 as cloudinary } from "cloudinary"
import errorHandler from "@/db/helpers/errorHandler"
import PlansData from "@/db/models/Plans";
import generateByPhoto from "@/services/generateRecipeByPhoto";
import UserPhoto from "@/db/models/generateRecipeByPhoto";
import { ObjectId } from "mongodb";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(req:Request){
    try {
        const formData = await req.formData();
        const file = formData.get('photo') as File;
        const plansId = formData.get('plansId') as string
        const userId = formData.get('userId') as string
        console.log(plansId,'ini plans id');
        
        
        if (!file) {
            return Response.json(
                { message: "No file uploaded" }, 
                { status: 400 }
            )
        }
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Upload buffer to Cloudinary
        const upload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'Fite-Meal',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });
        
        
        const payload = {
            plansId : new ObjectId(plansId),
            userId:new ObjectId(userId),
            photoUrl : upload.secure_url
        }
        await UserPhoto.insert(payload)
        const generateResponse = await generateByPhoto(payload)
        await PlansData.insert(generateResponse)
        
        return Response.json({generateResponse}, { status: 201 })
        
    } catch (error) {
        console.log(error)
        const { message, status } = errorHandler(error)
        return Response.json({ message }, { status })
    }
}