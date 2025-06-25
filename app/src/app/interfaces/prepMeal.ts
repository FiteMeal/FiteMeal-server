export type Root = Root2[]

export interface Root2 {
  name: string
  userId: string
  plans: Plan[]
}

export interface Plan {
  day: number
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
}

export interface Lunch {
  name: string
  imageUrl: string
  calories: number
  ingredients: string[]
  recipes: string[]
}

export interface Dinner {
  name: string
  imageUrl: string
  calories: number
  ingredients: string[]
  recipes: string[]
}
