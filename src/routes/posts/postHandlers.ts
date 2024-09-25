import { Request, ResponseToolkit } from "@hapi/hapi";
import { ObjectId } from "mongodb";
import { db } from "../../db-config";
import { IComments, IPosts } from "./postsModel";
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
      request.payload as object,
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

export const getArrayOfPosts = async (request: Request, h: ResponseToolkit) => {
  const id = new ObjectId(request.params.id);
  const page = Number(request.query.page);
  const pageSize = Number(request.query.pageSize);

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

    return h.response({ success: true, data: posts }).code(200);
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

export const deletePost = async (request: Request, h: ResponseToolkit) => {
  const id = new ObjectId(request.params.id);

  try {
    const result = postsCollection.deleteOne({ _id: id });
    if ((await result).deletedCount > 0) {
      return h.response({ success: true }).code(200);
    }
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

export const updatePostComment = async (
  request: Request,
  h: ResponseToolkit
) => {
  const postId = new ObjectId(request.query.postId);
  const commentId = new ObjectId(request.query.commentId);

  try {
    const update = await postsCollection.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      {
        $set: { "comments.$.content": (request.payload as any).content },
      },
      {
        returnDocument: "after",
      }
    );

    return h.response({ success: true, data: update }).code(200);
  } catch (error: any) {
    h.response({
      success: false,
      message: "Internal server error",
      error: error.message,
    }).code(500);
  }
};
