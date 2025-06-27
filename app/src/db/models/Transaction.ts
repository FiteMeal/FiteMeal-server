import { IMidtransRecord } from "@/app/interfaces/users";
import { Model } from "mongoloquent";

export default class Transaction extends Model<IMidtransRecord> {
  static $schema: IMidtransRecord;
  protected $collection: string = "transactions";
}
