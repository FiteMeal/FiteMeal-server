import { RecipeFromModel } from "@/app/interfaces/prepMeal";
import { Model } from "mongoloquent";

export default class UserPhoto extends Model<RecipeFromModel>{
    static $schema: RecipeFromModel;
    protected $collection: string = 'UserPhoto'
}