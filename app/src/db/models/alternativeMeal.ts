import { Plans } from "@/app/interfaces/prepMeal";
import { Model } from "mongoloquent";

export default class AlternativeMeal extends Model<Plans>{

    static $schema: Plans;
    protected $collection: string = 'alternativeMeals'
}