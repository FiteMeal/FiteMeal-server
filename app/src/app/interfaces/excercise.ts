import { ObjectId } from "mongodb"
import { IMongoloquentSchema, IMongoloquentTimestamps } from "mongoloquent"

export interface ExercisePlan extends IMongoloquentSchema, IMongoloquentTimestamps {
   userId: ObjectId
    name:string
    age: number
    weight: number
    height: number
    gender: string
    goals: string
    equipment:string
    duration : number
    startDate:string | Date
    endDate:string | Date
    todoList:TodoListExercise[]
}
export interface TodoListExercise {
  day: number
  date: string | Date
  excerciseName: string
  totalSession: string
  caloriesBurned: number
  sets: number
  reps: string
  targetMuscle: string
  isDone: boolean
}
