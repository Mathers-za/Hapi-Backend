import joi from "joi";
import { ObjectId } from "mongodb";
export const commentsSchema = joi.object({
  content: joi.string().required(),
  userId: joi.string().required(),
  _id: joi.object().default(() => new ObjectId()),
});

export const updateCommentSchema = joi.object({
  content: joi.string().required(),

  updatedAt: joi.date().default(() => new Date()),
});

export const postsSchema = joi.object({
  content: joi.string().required(),
  userId: joi.string().required(),
  createdAt: joi.date().default(() => new Date()),

  comments: joi.array().items(commentsSchema).optional(),
});

export const updatePostsSchema = joi.object({
  $set: joi
    .object({
      content: joi.string().required(),
      userId: joi.string().optional(),
      updatedAt: joi.date().optional().default(new Date()),
      comments: joi.array().items(commentsSchema).optional(),
    })
    .optional(),

  $push: joi
    .object({
      comments: commentsSchema.required(),
    })
    .optional(),
  $pull: joi
    .object({
      comments: joi.object({
        _id: joi.string().required(),
      }),
    })
    .optional(),
});
