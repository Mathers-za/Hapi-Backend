"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var postHandlers_1 = require("./postHandlers");
var postsJoiSchemas_1 = require("./postsJoiSchemas");
var joi_1 = __importDefault(require("joi"));
var routes = [
    {
        path: "/api/posts/create",
        method: "POST",
        handler: postHandlers_1.createPost,
        options: {
            validate: { payload: postsJoiSchemas_1.postsSchema },
            auth: false,
        },
    },
    {
        path: "/api/posts/delete/{id}",
        method: "DELETE",
        handler: postHandlers_1.deletePost,
        options: {
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().required(),
                }),
            },
        },
    },
    {
        path: "/api/posts/update/{id}",
        method: "PATCH",
        handler: postHandlers_1.updatePost,
        options: {
            auth: false,
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().required(),
                }),
                payload: postsJoiSchemas_1.updatePostsSchema,
            },
        },
    },
    {
        path: "/api/posts/updateComment",
        method: "PATCH",
        handler: postHandlers_1.updatePostComment,
        options: {
            auth: false,
            validate: {
                query: joi_1.default.object({
                    postId: joi_1.default.string().required(),
                    commentId: joi_1.default.string().required(),
                }),
                payload: joi_1.default.object({
                    content: joi_1.default.string().required(),
                    userId: joi_1.default.string().required(),
                    updatedAt: joi_1.default.date().required(),
                    commentId: joi_1.default.string().required(),
                }),
            },
        },
    },
    {
        path: "/api/posts/getFriendsPosts",
        method: "POST",
        handler: postHandlers_1.getArrayOfFriendsPosts,
        options: {
            auth: false,
            validate: {
                payload: joi_1.default.object({
                    page: joi_1.default.number().min(1).required(),
                    pageSize: joi_1.default.number().required().min(5).default(10),
                    friendsArray: joi_1.default.array(),
                }),
            },
        },
    },
    {
        path: "/api/posts/getUsersPosts/{userId}",
        method: "GET",
        handler: postHandlers_1.getUsersPosts,
        options: {
            auth: false,
            validate: {
                query: joi_1.default.object({
                    page: joi_1.default.string().required().default("1"),
                    pageSize: joi_1.default.string().required().default("10"),
                }),
                params: joi_1.default.object({
                    userId: joi_1.default.string().required(),
                }),
            },
        },
    },
    {
        path: "/api/posts/redisTest",
        method: "GET",
        handler: postHandlers_1.redisCachingOfPosts,
        options: {
            auth: false,
            description: "test endpoint for redis test drive",
        },
    },
];
exports.default = routes;
