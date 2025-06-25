import UserModel from "@/db/models/UserModel";

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const token = await UserModel.login(body)

        return Response.json({token}, {status: 200})

    } catch (error) {
        console.log(error);
        
    }
}