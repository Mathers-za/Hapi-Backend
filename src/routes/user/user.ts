import { ServerRoute, Request, ResponseToolkit } from "@hapi/hapi";
import joi from "joi";

import {
  findUsersByNameOrSurname,
  getUser,
  login,
  registerUser,
  updateUser,
} from "./handlers/userHandlers";
import { updateUserSchema, registerUserSchema } from "./schema/usersSchema";

const route: ServerRoute[] = [
  {
    method: "GET",
    path: "/api/user/get/{id}",

    handler: getUser,

    options: {
      validate: {
        params: joi.object({
          id: joi.string().example("4").description("User id").required(),
        }),
      },
    },
  },

  {
    method: "POST",
    path: "/api/user/registerUser",
    handler: registerUser,

    options: {
      auth: false,
      validate: {
        payload: registerUserSchema,
      },
    },
  },
  {
    method: "PATCH",
    path: "/api/user/updateUser/{id}",
    handler: updateUser,
    options: {
      validate: {
        params: joi.object({ id: joi.string().required() }),
        payload: updateUserSchema,
      },
    },
  },
  {
    path: "/api/user/login",
    method: "POST",
    handler: login,
    options: {
      auth: false,
      validate: {
        payload: joi.object({
          email: joi.string().email().required(),
          password: joi.string().required(),
        }),
      },
    },
  },
  {
    path: "/api/user/search",
    method: "GET",
    handler: findUsersByNameOrSurname,
    options: {
      auth: false,
      validate: {
        query: joi.object({
          searchString: joi.string().optional().allow(""),
          limit: joi.string().required().default("20"),
        }),
      },
    },
  },
];

export default route;
