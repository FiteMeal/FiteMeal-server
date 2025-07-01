import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import generateMealExercisePlan from "@/services/generateMealExercise";
import MealExercisePlan from "@/db/models/MealExercisePlan";
import PlansData from "@/db/models/Plans";
import dataExcercise from "@/db/models/dataExcercise";
import { ObjectId } from "mongodb";
import { Plans } from "@/app/interfaces/prepMeal";
import { Collection } from "mongoloquent";
import { ExercisePlan } from "@/app/interfaces/excercise";

export async function POST(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get('x-user-id');

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    const body = await req.json();
    body.userId = userId;
    
    console.log(body, "ini body meal exercise");

    // Validasi overlap untuk Meal-Exercise plan
    // Meal-Exercise plan tidak boleh overlap dengan Meal Plan atau Exercise Plan
    const userObjectId = new ObjectId(userId);
    const newStartDate = new Date(body.startDate);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + body.duration - 1);

    // Check overlap dengan Meal Plans (PrepMeal)
    const existingMealPlans = await PlansData.where('userId', userObjectId).get();
    
    // Check overlap dengan Exercise Plans
    const existingExercisePlans = await dataExcercise.where('userId', userObjectId).get();

    // Function untuk check date overlap
    const hasDateOverlap = (existingPlans : Collection<Plans> | Collection<ExercisePlan>) => {
      return existingPlans.some((plan) => {
        const planStart = new Date(plan.startDate) ;
        const planEnd = new Date(plan.endDate);
        
        // Check if new plan overlaps with existing plan
        return (newStartDate <= planEnd && newEndDate >= planStart);
      });
    };

    // Meal-Exercise plan tidak boleh overlap dengan Meal Plan atau Exercise Plan
    if (hasDateOverlap(existingMealPlans) || hasDateOverlap(existingExercisePlans)) {
      throw new CustomError(
        `Cannot create Meal-Exercise plan. There's already an existing Meal Plan or Exercise Plan within the date range ${newStartDate.toDateString()} - ${newEndDate.toDateString()}. Meal-Exercise plans cannot coexist with separate Meal or Exercise plans.`, 
        400
      );
    }

    const data = await generateMealExercisePlan(body);
    console.log(data, "ini data meal exercise");

    await MealExercisePlan.insert(data);

    return Response.json({ data }, { status: 201 });
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
    
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    // Convert string userId to ObjectId untuk match dengan database
    const userObjectId = new ObjectId(userId);
    
    // Gunakan .get() untuk mendapatkan semua data
    const mealExercisePlans = await MealExercisePlan.where('userId', userObjectId).get();

    if (!mealExercisePlans || mealExercisePlans.length === 0) {
      return Response.json({ 
        message: "No meal exercise plans found", 
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

    mealExercisePlans.forEach((plan) => {
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