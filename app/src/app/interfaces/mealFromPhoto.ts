import { TodoList } from "./prepMeal"

export interface MealByPhoto {
    name:string
    userId:string
    startDate:string
    todoList:TodoList[]
}