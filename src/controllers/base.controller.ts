import { ResponseToolkit } from "@hapi/hapi";

export class BaseController {
  handleErrorResponse(error: unknown, h: ResponseToolkit) {
    console.error(error);
    if (error instanceof Error) {
      return h
        .response({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
        .code(500);
    }
    //ignore bottom part for now. will add more once i define more types of error
    return h
      .response({
        success: false,
        message: "Internal server error",
        error: error,
      })
      .code(500);
  }
}
