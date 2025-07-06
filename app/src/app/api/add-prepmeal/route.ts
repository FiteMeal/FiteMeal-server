import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import OpenAi from "@/db/models/openAiModel";
import PlansData from "@/db/models/Plans";
import MealExercisePlan from "@/db/models/MealExercisePlan";
import { ObjectId } from "mongodb";
import { Collection } from "mongoloquent";
import { Plans } from "@/app/interfaces/prepMeal";
import { MealExercise } from "@/app/interfaces/mealExercise";

export async function POST(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get("x-user-id");
    console.log(req.headers,'ini headers dari add meal ')

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    const body = await req.json();
    body.userId = userId;
    console.log(body,'ini body');

    // Validasi overlap untuk Meal plan (PrepMeal)
    // Meal plan tidak boleh overlap dengan Meal-Exercise plan
    const userObjectId = new ObjectId(userId);
    const newStartDate = new Date(body.startDate);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + body.duration - 1);

    // Check overlap dengan Meal-Exercise Plans
    const existingMealExercisePlans = await MealExercisePlan.where('userId', userObjectId).get();
    
    // Check overlap dengan existing Meal Plans (same type)
    const existingMealPlans = await PlansData.where('userId', userObjectId).get();

    // Function untuk check date overlap
    const hasDateOverlap = (existingPlans: Collection<Plans> | Collection<MealExercise>) => {
      return existingPlans.some((plan) => {
        const planStart = new Date(plan.startDate);
        const planEnd = new Date(plan.endDate);
        
        // Check if new plan overlaps with existing plan
        return (newStartDate <= planEnd && newEndDate >= planStart);
      });
    };

    // Meal plan tidak boleh overlap dengan Meal-Exercise plan atau Meal plan lain
    if (hasDateOverlap(existingMealExercisePlans) || hasDateOverlap(existingMealPlans)) {
      const conflictType = hasDateOverlap(existingMealExercisePlans) ? "Meal-Exercise" : "Meal";
      throw new CustomError(
        `Cannot create Meal plan. There's already an existing ${conflictType} plan within the date range ${newStartDate.toDateString()} - ${newEndDate.toDateString()}. Meal plans cannot overlap with other Meal plans or Meal-Exercise plans.`, 
        400
      );
    }

    const resp = await OpenAi.generatePrepMeal(body);

    return Response.json({ resp }, { status: 201 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}

export async function GET(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const userId = req.headers.get("x-user-id");
    
    console.log(userId, "ini user id <<<");
    
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    // Convert string userId to ObjectId untuk match dengan database
    const userObjectId = new ObjectId(userId);
    console.log(userObjectId,'objectid');
    
    // Gunakan .get() untuk mendapatkan semua data, bukan .first()
    const prepMeals = await PlansData.where('userId', userObjectId).get();

    if (!prepMeals || prepMeals.length === 0) {
      return Response.json({ 
        message: "No prep meals found", 
        data: {
          ongoing: [],
          upcoming: []
        }
      }, { status: 200 });
    }

    // Bagi antara ongoing dan upcoming berdasarkan tanggal hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke midnight untuk comparison yang akurat

    const ongoing: unknown[] = [];
    const upcoming: unknown[] = [];

    prepMeals.forEach((plan) => {
      const startDate = new Date(plan.startDate);
      const endDate = new Date(plan.endDate);
      
      // Set ke midnight untuk comparison yang akurat
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      // Jika hari ini berada dalam range startDate - endDate = ongoing
      // Jika startDate masih di masa depan = upcoming
      if (today >= startDate && today <= endDate) {
        ongoing.push(plan);
      } else if (startDate > today) {
        upcoming.push(plan);
      }
      // Plans yang sudah lewat (endDate < today) tidak dimasukkan
    });

    return Response.json({ 
      data: {
        ongoing: ongoing,
        upcoming: upcoming
      }
    }, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}