import { ExercisePlan } from "@/app/interfaces/excercise";
import { Model } from "mongoloquent";

export default class dataExcercise extends Model<ExercisePlan>{

    static $schema: dataExcercise;
    protected $collection: string = 'exercisePlan'
}