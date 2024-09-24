"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var db_config_1 = require("../../db-config");
var userHandlers_1 = require("./handlers/userHandlers");
var usersSchema_1 = require("./schema/usersSchema");
var db = db_config_1.client.db("twitterKnockOff");
var users = db.collection("users");
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
        path: "/api/user/createUser",
        handler: userHandlers_1.createUser,
        options: {
            validate: {
                payload: usersSchema_1.userCreateSchema,
                failAction: function (request, h, err) {
                    throw err;
                },
                options: { abortEarly: true },
            },
        },
    },
    {
        method: "PATCH",
        path: "/api/user/updateUser",
        handler: userHandlers_1.updateUser,
        options: {
            validate: {
                payload: joi_1.default.object({
                    firstName: joi_1.default.string().optional().empty(""),
                    lastName: joi_1.default.string().optional().empty(""),
                    email: joi_1.default.string().optional().empty(""),
                }),
                options: { abortEarly: true },
            },
        },
    },
];
exports.default = route;
