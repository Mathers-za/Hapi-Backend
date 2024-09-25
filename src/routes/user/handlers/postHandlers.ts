import { Request, ResponseToolkit } from "@hapi/hapi";
import { ObjectId } from "mongodb";
import { db } from "../../../db-config";
import { IComments, IPosts } from "../../../models/postsModel";
import { skip } from "node:test";

const postsCollection = db.collection("posts");
export const createPost = async (request: Request, h: ResponseToolkit) => {
  try {
    await postsCollection.insertOne(request.payload as IPosts);
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

export const updatePost = async (request: Request, h: ResponseToolkit) => {
  const id = new ObjectId(request.params.id);

  try {
    const updatedDocument = await postsCollection.findOneAndUpdate(
      { _id: id },
      request.payload as Partial<IComments>,
      { returnDocument: "after" }
    );

    return h.response({ success: true, data: updatedDocument }).code(200);
  } catch (error: any) {
    h.response({
      success: false,
      message: "Internal server error",
      error: error.message,
    }).code(500);
  }
};

export const getPost = async (request: Request, h: ResponseToolkit) => {
  const id = new ObjectId(request.params.id);

  try {
    const post = await postsCollection.findOne({ _id: id });
    return h.response({ success: true, data: post }).code(200);
  } catch (error: any) {
    h.response({
      success: false,
      message: "Internal server error",
      error: error.message,
    }).code(500);
  }
};

const getArrayOfPosts = async (request: Request, h: ResponseToolkit) => {
  const id = new ObjectId(request.params.id);
  const { pageSize, page } = request.query;
  const offset = page - 1 * 10;

  try {
    //for aggregation practice
    const posts = postsCollection
      .aggregate([
        {
          $match: {
            userId: id,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            user: { $arrayElemAt: ["$user", 0] },
            comments: 1,
          },
        },

        {
          $sort: {
            date: -1,
          },
        },
        { $skip: offset },

        {
          $limit: pageSize,
        },
      ])
      .toArray();

    h.response({ success: true, data: posts });
  } catch (error: any) {
    h.response({
      success: false,
      message: "Internal server error",
      error: error.message,
    }).code(500);
  }
};
