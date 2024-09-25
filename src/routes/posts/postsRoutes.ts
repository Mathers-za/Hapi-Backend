import { ServerRoute } from "@hapi/hapi";
import {
  createPost,
  deletePost,
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
];

export default routes;
