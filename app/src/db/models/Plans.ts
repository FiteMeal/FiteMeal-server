import { Plans } from "@/app/interfaces/prepMeal";
import { Model } from "mongoloquent";


export default class PlansData extends Model<Plans>{
    static $schema: Plans;
    protected $collection: string = 'mealPlans'
}