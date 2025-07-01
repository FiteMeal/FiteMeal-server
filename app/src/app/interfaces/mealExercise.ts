import { ObjectId } from "mongodb"
import { IMongoloquentSchema, IMongoloquentTimestamps } from "mongoloquent"

export interface MealExercise extends IMongoloquentSchema, IMongoloquentTimestamps {
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
    endDate:string
}