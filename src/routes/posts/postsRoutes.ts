import { ServerRoute } from "@hapi/hapi";
import {
  createPost,
  deletePost,
  getArrayOfFriendsPosts,
  getUsersPosts,
  updatePost,
  updatePostComment,
} from "./postHandlers";
import {
  commentsSchema,
  postsSchema,
  updateCommentSchema,
  updatePostsSchema,
} from "./postsJoiSchemas";
import joi, { disallow } from "joi";

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
        payload: updateCommentSchema,
      },
    },
  },
  {
    path: "/api/posts/getFriendsPosts",
    method: "POST",
    handler: getArrayOfFriendsPosts,
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
    path: "/api/posts/getUsersPosts",
    method: "GET",
    handler: getUsersPosts,
    options: {
      auth: false,
      validate: {
        query: joi.object({
          page: joi.string().required().default("1"),
          pageSize: joi.string().required().default("10"),
        }),
      },
    },
  },
];

export default routes;
