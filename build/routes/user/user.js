"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var userHandlers_1 = require("./handlers/userHandlers");
var usersSchema_1 = require("./schema/usersSchema");
var route = [
    {
        method: "GET",
        path: "/api/user/get/{id}",
        handler: userHandlers_1.getUser,
        options: {
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().example("4").description("User id").required(),
                }),
            },
        },
    },
    {
        method: "POST",
        path: "/api/user/registerUser",
        handler: userHandlers_1.registerUser,
        options: {
            auth: false,
            validate: {
                payload: usersSchema_1.registerUserSchema,
            },
        },
    },
    {
        method: "PATCH",
        path: "/api/user/updateUser/{id}",
        handler: userHandlers_1.updateUser,
        options: {
            validate: {
                params: joi_1.default.object({ id: joi_1.default.string().required() }),
                payload: usersSchema_1.updateUserSchema,
            },
        },
    },
    {
        path: "/api/user/login",
        method: "POST",
        handler: userHandlers_1.login,
        options: {
            auth: false,
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email().required(),
                    password: joi_1.default.string().required(),
                }),
            },
        },
    },
    {
        path: "/api/user/search",
        method: "GET",
        handler: userHandlers_1.findUsersByNameOrSurname,
        options: {
            auth: false,
            validate: {
                query: joi_1.default.object({
                    searchString: joi_1.default.string().optional().allow(""),
                    limit: joi_1.default.string().required().default("20"),
                }),
            },
        },
    },
];
exports.default = route;
