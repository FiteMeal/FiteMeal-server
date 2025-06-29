import { RecipeFromModel } from "@/app/interfaces/prepMeal";
import { extractIngredientsFromImage } from "./analyzedImage";
import generateMealFromIngredients from "./generateMealFromIngredients";

export default async function generateByPhoto(payload: RecipeFromModel) {
  console.log("Payload:", payload);

  const ingredientsText = await extractIngredientsFromImage(payload.photoUrl);
  console.log("Detected ingredients:", ingredientsText);

  const finalMealPlan = await generateMealFromIngredients(payload, ingredientsText);
  console.log("Final meal plan:", finalMealPlan);

  return finalMealPlan;
}
