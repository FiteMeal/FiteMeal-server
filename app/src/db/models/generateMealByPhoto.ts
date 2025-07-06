import { Model } from "mongoloquent";

export default class MealByPhoto extends Model<MealByPhoto> {
    static $schema: MealByPhoto;
    protected $collection: string = 'MealByPhoto'
}