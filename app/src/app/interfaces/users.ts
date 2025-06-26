import { IMongoloquentSchema, IMongoloquentTimestamps } from "mongoloquent"

export interface IUsers extends IMongoloquentSchema,IMongoloquentTimestamps {
    name: string,
    username: string,
    email: string,
    password: string,
    gender: string
}

export interface ILogin extends IMongoloquentSchema,IMongoloquentTimestamps {
    email: string,
    password: string
}