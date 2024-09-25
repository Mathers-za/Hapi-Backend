import { ObjectId } from "mongodb";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../../../db-config";
import bcrypt from "bcrypt";
import { IRegisterUser, IUser } from "../userModel";

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

export const registerUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as IRegisterUser;
    delete payload.passwordConfirm;

    const { email, password } = payload as any;

    const user = await userCollection.findOne({
      email: email,
    });
    if (user !== null) {
      return h
        .response({
          success: false,
          message: "User with this email address already exists",
        })
        .code(400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userCollection.insertOne({ ...payload, password: hashedPassword });

    return h.response({ success: true }).code(201);
  } catch (error: any) {
    console.error(error);
    h.response({
      success: false,
      message: "Internal server error",
      error: error.message,
    }).code(500);
  }
};

export const updateUser = async (request: Request, h: ResponseToolkit) => {
  const id = request.params.id;
  try {
    const updatedDocument = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: request.payload as IUser },
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

export const login = async (request: Request, h: ResponseToolkit) => {
  const { password, email } = request.payload as any;
  try {
    const user = await userCollection.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      request.cookieAuth.set({ id: user._id });
      return h
        .response({ success: true, message: "successfully logged in" })
        .redirect("/")
        .code(200);
    } else {
      return h
        .response({ success: false, message: "unsuccessful login attempt" })
        .redirect("/login")
        .code(401);
    }
  } catch (error: any) {
    console.error(error);
    return h.response({ success: false, error: error.message }).code(500);
  }
};
