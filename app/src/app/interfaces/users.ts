import { IMongoloquentSchema, IMongoloquentTimestamps } from "mongoloquent"

export interface IUsers extends IMongoloquentSchema,IMongoloquentTimestamps {
    name: string,
    username: string,
    email: string,
    password: string,
    gender: string,
    dateOfBirth: string,
    height: number,
    weight: number,
    activityLevel: string
    isPremium: boolean
}

export interface ILogin extends IMongoloquentSchema,IMongoloquentTimestamps {
    email: string,
    password: string
}

export interface IMidtransRecord extends IMongoloquentSchema, IMongoloquentTimestamps {
    orderId: string,
    amount: number,
    status: string,
    midtransToken: string,
    userId: string,
    redirectUrl: string
}