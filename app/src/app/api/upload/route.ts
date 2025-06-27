import { parseForm } from "@/db/helpers/parseForm"
import { v2 as cloudinary } from "cloudinary"
import errorHandler from "@/db/helpers/errorHandler"
import formidable from "formidable"

export const config = {
    api : {
        bodyParser: false
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(req:Request){
    try {
        const formData = await req.formData();
        const file = formData.get('photo') as File;
        
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
        
        
        return Response.json({
            message: "Upload successful",
            url: (upload as unknown).secure_url,
            public_id: (upload as unknown).public_id
        }, { status: 201 })
        
    } catch (error) {
        console.log(error)
        const { message, status } = errorHandler(error)
        return Response.json({ message }, { status })
    }
}