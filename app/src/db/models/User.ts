import { IUsers } from "@/app/interfaces/users";
import { Model } from "mongoloquent";

export default class User extends Model<IUsers>{
    static $schema: IUsers
    protected $collection: string = 'users'
}