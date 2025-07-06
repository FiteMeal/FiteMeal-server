import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import dataExcercise from "@/db/models/dataExcercise";
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

    const { id } = await params;

    if (!id) {
      throw new CustomError("Exercise ID is required", 400);
    }

    const exercise = await dataExcercise.where('_id', id).first();
    console.log(exercise,'ini exer');
    

    if (!exercise) {
      throw new CustomError("Exercise not found", 404);
    }

    return Response.json(exercise, { status: 200 });
  } catch (error) {
    const { message, status } = errorHandler(error);
    return Response.json({ message }, { status });
  }
}
  export async function PATCH(req: Request, { params }: { params:Promise<{ id: string }> }) {
    try {
      const userEmail = req.headers.get("x-user-email");
      // const userId = req.headers.get("x-user-id");
  
      if (!userEmail) {
        throw new CustomError(`Unauthorized! Please login first!`, 401);
      }
  
      const { id } = await params;
      const objectId = new ObjectId(id);
      const { day, isDone } = await req.json();
  
      if (!day || typeof isDone !== 'boolean') {
        throw new CustomError("Missing required fields: day, isDone", 400);
      }
  
     
  
      const plan = await dataExcercise.where('_id', objectId).first();
  
      if (!plan) {
        throw new CustomError("Plan not found", 404);
      }
  
      const todos = plan.todoList?.map((todo) => {
        if (todo.day === day) {
          
            todo.isDone = isDone;
           
          }
        
      
        return todo;
      });
  
       await dataExcercise.where("_id", objectId).update({ 
        todoList: todos,
      });
  
     
  
      
      const updatedPlan = await dataExcercise.where('_id', objectId).first();
  
      return Response.json({ 
        message: "Task updated successfully",
        data: updatedPlan 
      }, { status: 200 });
  
    } catch (error) {
      const { message, status } = errorHandler(error);
      return Response.json({ message }, { status });
    }
  }
