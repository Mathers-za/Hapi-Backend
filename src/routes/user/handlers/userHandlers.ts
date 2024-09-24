import { ObjectId } from "mongodb";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../../../db-config";
import { error } from "console";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
const userCollection = db.collection("users");
export const getUser = async (request: Request, h: ResponseToolkit) => {
  const id = new ObjectId(request.params.id);

  try {
    const user = await userCollection.findOne({ _id: id });
    return h.response({ success: true, data: user }).code(200);
  } catch (error: any) {
    console.error(error);
    return h
      .response({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
      .code(500);
  }
};

export const createUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const { password, passwordConfirm, email } = request.payload as IUser;
    const user = await userCollection.findOne({
      email: email
    });
    if (user !== null) {
      throw new Error("User already exists");
    }
    
    await userCollection.insertOne(request.payload as object);

    return h.response({ success: true }).code(201);
  } catch (error: any) {
    console.error(error);
    h.response({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateUser = async (request: Request, h: ResponseToolkit) => {
  const id = request.params.id;
  try {
    const updatedDocument = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: request.payload as object },
      { returnDocument: "after" }
    );
    if (updatedDocument?._id) {
      return h.response({ success: true, data: updatedDocument }).code(200);
    } else throw new Error("Failed to update");
  } catch (error: any) {
    console.error(error);
    return h.response({ success: false, error: error.message }).code(500);
  }
};
