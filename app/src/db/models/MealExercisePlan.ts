import { MealExercise } from "@/app/interfaces/mealExercise";
import { Model } from "mongoloquent";


export default class MealExercisePlan extends Model<MealExercise>{
    static $schema: MealExercise;
    protected $collection: string = 'mealExercisePlans'
}