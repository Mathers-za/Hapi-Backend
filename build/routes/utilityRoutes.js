"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customNotFoundRoute = void 0;
exports.customNotFoundRoute = {
    method: "*",
    path: "/{any*}",
    handler: function (request, h) {
        return h
            .response({
            success: false,
            statusCode: 404,
            error: "BadRequest",
            message: "error: Not found error on Url: ".concat(h.request.url, " not found"),
        })
            .code(404);
    },
};
