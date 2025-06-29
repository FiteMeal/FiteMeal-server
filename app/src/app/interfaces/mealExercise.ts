import { ObjectId } from "mongodb"

export interface MealExercise {
   userId: ObjectId
    name:string
    age: number
    weight: number
    height: number
    gender: string
    activity_level: string  // Missing property
    goals: string
    preferences?: string    // Missing property (optional)
    equipment: string
    duration: number
    startDate: string
}