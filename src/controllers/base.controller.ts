import { ResponseToolkit } from "@hapi/hapi";
import { RedisError } from "../errors/redis.errors";

export class BaseController {
  protected handleErrorResponse(error: any, h: ResponseToolkit) {
    console.error(error);
    if (error instanceof RedisError) {
      return h
        .response({
          name: error.name,
          success: false,
          message: error.message,
          error: error,
        })
        .code(500);
    }

    return h
      .response({
        success: false,
        message: "Internal server error",
        error: error,
      })
      .code(500);
  }
}
