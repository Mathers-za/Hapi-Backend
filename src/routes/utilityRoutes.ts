import { ServerRoute, Request, ResponseToolkit } from "@hapi/hapi";

export const customNotFoundRoute: ServerRoute = {
  method: "*",
  path: "/{any*}",
  handler: (request: Request, h: ResponseToolkit) => {
    return h
      .response({
        success: false,
        statusCode: 404,
        error: "BadRequest",
        message: `error: Not found error on Url: ${h.request.url} not found`,
      })
      .code(404);
  },
};
