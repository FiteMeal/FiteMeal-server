import { ObjectId } from "mongodb"

export interface MealExercise {
   userId: ObjectId
    name:string
    age: number
    weight: number
    height: number
    gender: string
    activity_level: string  
    goals: string
    preferences?: string    
    equipment: string
    duration: number
    startDate: string
}