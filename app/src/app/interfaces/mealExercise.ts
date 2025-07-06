import { ObjectId } from "mongodb";
import { IMongoloquentSchema, IMongoloquentTimestamps } from "mongoloquent";

export interface MealExercise
  extends IMongoloquentSchema,
    IMongoloquentTimestamps {
  userId: ObjectId;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activity_level: string;
  goals: string;
  preferences?: string;
  equipment: string;
  duration: number;
  startDate: string | Date;
  endDate: string | Date;
  todoList: TodoListExerciseME[];
}

export interface TodoListExerciseME {
  day: number;
  date: string;
  dailyCalories: number;
  breakfast: Breakfast;
  lunch: Lunch;
  dinner: Dinner;
  exercise: Exercise;
}

export interface TodoList {
  day: number;
  date: string;
  dailyCalories: number;
  breakfast: Breakfast;
  lunch: Lunch[];
  dinner: Dinner[];
  exercise: Exercise[];
}

export interface Breakfast {
  name: string;
  imageUrl: string;
  calories: number;
  ingredients: string[];
  recipes: string[];
  isDone: boolean;
  notes: string;
}

export interface Lunch {
  name: string;
  imageUrl: string;
  calories: number;
  ingredients: string[];
  recipes: string[];
  isDone: boolean;
  notes: string;
}

export interface Dinner {
  name: string;
  imageUrl: string;
  calories: number;
  ingredients: string[];
  recipes: string[];
  isDone: boolean;
  notes: string;
}

export interface Exercise {
  exerciseName: string;
  totalSession: string;
  exercises: Exercise2[];
  caloriesBurned: number;
  notes: string;
  isDone: boolean;
}

export interface Exercise2 {
  name: string;
  sets: number;
  reps: string;
  targetMuscle: string;
  equipment: string;
}
