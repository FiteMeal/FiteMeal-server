import { ZodError } from "zod"
import { CustomError } from "./CustomError"

export default function errorHandler(err: unknown): { message: string, status: number } {
    const result = { message: "Internal Server Error", status: 500 }

    if (err instanceof ZodError) {
        const error = err.errors[0]
        result.message = `${error.path[0]} - ${error.message}`
        result.status = 400
    } else if (err instanceof CustomError) {
        result.message = err.message
        result.status = err.status        
    }

    return result
}