import { ServerRoute, Request, ResponseToolkit } from "@hapi/hapi";
import joi from "joi";
import { client } from "../../db-config";

import { createUser, getUser, updateUser } from "./handlers/userHandlers";
import { updateUserSchema, userCreateSchema } from "./schema/usersSchema";

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
    path: "/api/user/createUser",
    handler: createUser,

    options: {
      validate: {
        payload: userCreateSchema,
        failAction: (request, h, err) => {
          throw err;
        },
        options: { abortEarly: true },
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
        options: { abortEarly: false },
      },
    },
  },
];

export default route;
