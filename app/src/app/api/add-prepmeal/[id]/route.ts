import { TodoList } from "@/app/interfaces/prepMeal";
import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import PlansData from "@/db/models/Plans";
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

    const userId = req.headers.get("x-user-id")
    console.log(userId, "ini user id <<<");
    

    const { id } = await params;

    if (!id) {
      throw new CustomError("Prep meal ID is required", 400);
    }

    const prepMeal = await PlansData.where('_id',id).get();

    if (!prepMeal) {
      throw new CustomError("Prep meal not found", 404);
    }

    return Response.json(prepMeal, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get("x-user-id");

    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401);
    }

    const { id } = await params;
    const objectId = new ObjectId(id);
    const { day, type, notes, isDone } = await req.json();

    if (!day || !type || typeof isDone !== 'boolean') {
      throw new CustomError("Missing required fields: day, type, isDone", 400);
    }

    const validTypes = ['breakfast', 'lunch', 'dinner'];
    if (!validTypes.includes(type)) {
      throw new CustomError("Invalid type. Must be: breakfast, lunch, or dinner", 400);
    }

    const plan = await PlansData.where('_id', objectId).first();

    if (!plan) {
      throw new CustomError("Plan not found", 404);
    }

    const todos = plan.todoList?.map((todo: unknown) => {
      if (todo.day === day) {
         if (todo[type]) {
          todo[type].isDone = isDone;
          if (notes !== undefined) {
            todo[type].notes = notes;
          }
        }
      }
      return todo;
    });

    // ✅ FIX: Update with proper error handling
    const result = await PlansData.where("_id", objectId).update({ 
      todoList: todos,
      updatedAt: new Date()
    });

    if (result.modifiedCount === 0) {
      throw new CustomError("Failed to update plan", 400);
    }

    // ✅ FIX: Return updated plan
    const updatedPlan = await PlansData.where('_id', objectId).first();

    return Response.json({ 
      message: "Task updated successfully",
      data: updatedPlan 
    }, { status: 200 });

  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}