import { ObjectId } from "mongodb"
import { IMongoloquentSchema, IMongoloquentTimestamps } from "mongoloquent"

export type Root = Plans[]

export interface Plans extends IMongoloquentSchema,IMongoloquentTimestamps {
  name: string
  userId: string
  startDate:string
  todoList: TodoList[]
}

export interface TodoList {
  day: number
  date:string
  dailycalories: number
  breakfast: Breakfast
  lunch: Lunch
  dinner: Dinner
}

export interface Breakfast {
  name: string
  imageUrl: string
  calories: number
  ingredients: string[]
  recipes: string[]
  isDone:boolean
  notes:string
}

export interface Lunch {
  name: string
  imageUrl: string
  calories: number
  ingredients: string[]
  recipes: string[]
  isDone:boolean
  notes:string
}

export interface Dinner {
  name: string
  imageUrl: string
  calories: number
  ingredients: string[]
  recipes: string[]
  isDone:boolean
  notes:string
}
export interface FormPrep extends IMongoloquentSchema, IMongoloquentTimestamps {
  userId: ObjectId
  name:string
  age: number
  weight: number
  height: number
  gender: string
  activity_level: string
  goals: string
  preferences: string
  duration : number
  startDate:string
}
export interface RecipeFromModel extends IMongoloquentSchema,IMongoloquentTimestamps{
  userId : ObjectId
  plansId:ObjectId
  photoUrl:string
}