import { extractIngredientsFromImage } from "./analyzedImage";
import generateMealFromIngredients from "./generateMealFromIngredients";
import { ObjectId } from "mongodb";

export default async function generateByPhoto(payload: { userId : ObjectId
  plansId:ObjectId
  photoUrl:string}) {
  console.log("Payload:", payload);

  const ingredientsText = await extractIngredientsFromImage(payload.photoUrl);
  console.log("Detected ingredients:", ingredientsText);

  const finalMealPlan = await generateMealFromIngredients(payload, ingredientsText);
  console.log("Final meal plan:", finalMealPlan);

  return finalMealPlan;
}
