import { Request, ResponseToolkit } from "@hapi/hapi";
import { ObjectId } from "mongodb";
import { db } from "../../db-config";
import { IPosts } from "./postsModel";
import { getOrSetRedisCache } from "../../untily-functions/redisfns";

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

export const getArrayOfFriendsPosts = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { page, pageSize, friendsArray } = request.payload as any;

  const offset = page - 1 * 10;

  try {
    //for aggregation practice
    const posts = postsCollection
      .aggregate([
        {
          $match: {
            userId: { $in: friendsArray },
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
            user: 1,
            comments: 1,
          },
        },
        {
          $unwind: "$user",
        },
        { $addFields: { commentsCount: { $size: "$comments" } } },

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
  const { postId, commentId, content } = request.payload as any;

  try {
    const update = await postsCollection.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      {
        $set: { "comments.$.content": content },
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

export const getUsersPosts = async (request: Request, h: ResponseToolkit) => {
  const userId = new ObjectId(request.params.userId);
  const page = Number(request.query.page);
  const pageSize = Number(request.query.pageSize);
  const offset = (page - 1) * pageSize;

  try {
    const posts = await postsCollection
      .aggregate([
        {
          $match: { userId: userId },
        },
        {
          $sort: { date: -1 },
        },
        {
          $skip: offset,
        },
        {
          $limit: pageSize,
        },
      ])
      .toArray();

    h.response({ success: true, data: posts }).code(200);
  } catch (error: any) {
    h.response({
      success: false,
      message: "Internal server error",
      error: error.message,
    }).code(500);
  }
};

export const redisCachingOfPosts = async (
  request: Request,
  h: ResponseToolkit
) => {
  const userId = request.params.id;

  try {
    const data = await getOrSetRedisCache("posts", async () => {
      return await postsCollection.find().toArray();
    });

    return h.response({ success: true, data: data });
  } catch (error: any) {
    return h.response({
      message: "Internal server error",
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
};
