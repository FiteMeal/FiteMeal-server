import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import dataExcercise from "@/db/models/dataExcercise";
import generateExercise from "@/services/generateExercise";
import MealExercisePlan from "@/db/models/MealExercisePlan";
import { ObjectId } from "mongodb";

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

    // Validasi overlap untuk Exercise plan
    // Exercise plan tidak boleh overlap dengan Meal-Exercise plan
    const userObjectId = new ObjectId(userId);
    const newStartDate = new Date(body.startDate);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + body.duration - 1);

    // Check overlap dengan Meal-Exercise Plans
    const existingMealExercisePlans = await MealExercisePlan.where('userId', userObjectId).get();
    
    // Check overlap dengan existing Exercise Plans (same type)
    const existingExercisePlans = await dataExcercise.where('userId', userObjectId).get();

    // Function untuk check date overlap
    const hasDateOverlap = (existingPlans: unknown[]) => {
      return existingPlans.some((plan: unknown) => {
        const planStart = new Date(plan.startDate);
        const planEnd = new Date(plan.endDate);
        
        // Check if new plan overlaps with existing plan
        return (newStartDate <= planEnd && newEndDate >= planStart);
      });
    };

    // Exercise plan tidak boleh overlap dengan Meal-Exercise plan atau Exercise plan lain
    if (hasDateOverlap(existingMealExercisePlans) || hasDateOverlap(existingExercisePlans)) {
      const conflictType = hasDateOverlap(existingMealExercisePlans) ? "Meal-Exercise" : "Exercise";
      throw new CustomError(
        `Cannot create Exercise plan. There's already an existing ${conflictType} plan within the date range ${newStartDate.toDateString()} - ${newEndDate.toDateString()}. Exercise plans cannot overlap with other Exercise plans or Meal-Exercise plans.`, 
        400
      );
    }

    const data = await generateExercise(body);
    console.log(data, "ini data");
    console.log(body, "ini body");

    await dataExcercise.insert(data);

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
    const exercises = await dataExcercise.where('userId', userObjectId).get();

    if (!exercises || exercises.length === 0) {
      return Response.json({ 
        message: "No exercises found", 
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

    exercises.forEach((plan: unknown) => {
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
