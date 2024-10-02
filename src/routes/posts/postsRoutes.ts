import { ResponseToolkit, Request, ServerRoute } from "@hapi/hapi";
import { PostsController } from "../../controllers/posts.controller";
import {
  createPost,
  deletePost,
  getArrayOfFriendsPosts,
  getUsersPosts,
  redisCachingOfPosts,
  updatePost,
  updatePostComment,
} from "./postHandlers";
import {
  commentsSchema,
  postsSchema,
  updateCommentSchema,
  updatePostsSchema,
} from "./postsJoiSchemas";
import joi from "joi";

const postsController = new PostsController();

const routes: ServerRoute[] = [
  {
    path: "/api/posts/create",
    method: "POST",
    handler: createPost,
    options: {
      validate: { payload: postsSchema },
      auth: false,
    },
  },

  {
    path: "/api/posts/delete/{id}",
    method: "DELETE",
    handler: deletePost,
    options: {
      validate: {
        params: joi.object({
          id: joi.string().required(),
        }),
      },
    },
  },
  {
    path: "/api/posts/update/{id}",
    method: "PATCH",
    handler: updatePost,
    options: {
      auth: false,
      validate: {
        params: joi.object({
          id: joi.string().required(),
        }),
        payload: updatePostsSchema,
      },
    },
  },
  {
    path: "/api/posts/updateComment",
    method: "PATCH",
    handler: updatePostComment,
    options: {
      auth: false,
      validate: {
        query: joi.object({
          postId: joi.string().required(),
          commentId: joi.string().required(),
        }),
        payload: joi.object({
          content: joi.string().required(),
          userId: joi.string().required(),
          updatedAt: joi.date().required(),
          commentId: joi.string().required(),
        }),
      },
    },
  },
  {
    path: "/api/posts/getFriendsPosts",
    method: "POST",
    handler: async (request: Request, h: ResponseToolkit) => {
      return postsController.getFriendsPosts(request, h);
    },
    options: {
      auth: false,
      validate: {
        payload: joi.object({
          page: joi.number().min(1).required(),
          pageSize: joi.number().required().min(5).default(10),
          friendsArray: joi.array(),
        }),
      },
    },
  },
  {
    path: "/api/posts/getUsersPosts/{userId}",
    method: "GET",
    handler: getUsersPosts,
    options: {
      auth: false,
      validate: {
        query: joi.object({
          page: joi.string().required().default("1"),
          pageSize: joi.string().required().default("10"),
        }),
        params: joi.object({
          userId: joi.string().required(),
        }),
      },
    },
  },

  {
    path: "/api/posts/redisTest",
    method: "GET",
    handler: redisCachingOfPosts,
    options: {
      auth: false,
      description: "test endpoint for redis test drive",
    },
  },
];

export default routes;
