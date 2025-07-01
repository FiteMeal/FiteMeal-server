import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import MealExercisePlan from "@/db/models/MealExercisePlan";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const userId = req.headers.get("x-user-id");
    console.log(userId, "ini user id <<<");

    const { id } = await params;

    if (!id) {
      throw new CustomError("Meal-Exercise plan ID is required", 400);
    }

    const mealExercisePlan = await MealExercisePlan.where('_id', id).first();

    if (!mealExercisePlan) {
      throw new CustomError("Meal-Exercise plan not found", 404);
    }

    return Response.json(mealExercisePlan, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const { id } = await params;
    const objectId = new ObjectId(id);
    const { day, type, notes, isDone, planType, exerciseIndex } = await req.json();

    if (!day || typeof isDone !== 'boolean' || !planType) {
      throw new CustomError("Missing required fields: day, isDone, planType", 400);
    }

    const validPlanTypes = ['meal', 'exercise'];
    if (!validPlanTypes.includes(planType)) {
      throw new CustomError("Invalid planType. Must be: meal or exercise", 400);
    }

    // Validation for meal type
    if (planType === 'meal') {
      if (!type) {
        throw new CustomError("Missing required field: type for meal plan", 400);
      }
      const validMealTypes = ['breakfast', 'lunch', 'dinner'];
      if (!validMealTypes.includes(type)) {
        throw new CustomError("Invalid type. Must be: breakfast, lunch, or dinner", 400);
      }
    }

    // Validation for exercise type
    if (planType === 'exercise') {
      if (typeof exerciseIndex !== 'number') {
        throw new CustomError("Missing required field: exerciseIndex for exercise plan", 400);
      }
    }

    const plan = await MealExercisePlan.where('_id', objectId).first();

    if (!plan) {
      throw new CustomError("Plan not found", 404);
    }

    let todos;

    if (planType === 'meal') {
      // Update meal plan todo
      todos = plan.todoList?.map((todo) => {
        if (todo.day === day) {
          const currentMeal = todo[type as 'breakfast' | 'lunch' | 'dinner'];
          return {
            ...todo,
            [type]: {
              ...currentMeal,
              isDone: isDone,
              notes: notes || ""
            }
          };
        }
        return todo;
      });
    } else {
      // Update exercise plan todo
      todos = plan.todoList?.map((todo) => {
        if (todo.day === day) {
          const updatedExercises = todo.exercise.exercises.map((exercise, index) => {
            if (index === exerciseIndex) {
              return {
                ...exercise,
                isDone: isDone
              };
            }
            return exercise;
          });
          
          return {
            ...todo,
            exercise: {
              ...todo.exercise,
              exercises: updatedExercises
            }
          };
        }
        return todo;
      });
    }

    const result = await MealExercisePlan.where("_id", objectId).update({ 
      todoList: todos,
    });

    if (!result) {
      throw new CustomError("Failed to update plan", 400);
    }

    const updatedPlan = await MealExercisePlan.where('_id', objectId).first();

    return Response.json({ 
      message: "Task updated successfully",
      data: updatedPlan 
    }, { status: 200 });

  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}