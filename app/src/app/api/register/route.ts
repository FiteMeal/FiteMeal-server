import {IUsers} from "@/app/interfaces/users";
import errorHandler from "@/db/helpers/errorHandler";
import UserModel from "@/db/models/UserModel";

export async function POST(req: Request) {
    try {
        const body: IUsers = await req.json()
        const message = await UserModel.register(body)
        return Response.json({message}, {status: 201})
    } catch (error) {
        const {message, status} = errorHandler(error)
        return Response.json({message}, {status})
    }
}