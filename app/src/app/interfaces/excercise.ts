import { ObjectId } from "mongodb"

export interface ExercisePlan {
   userId: ObjectId
    name:string
    age: number
    weight: number
    height: number
    gender: string
    goals: string
    equipment:string
    duration : number
    startDate:string
}
