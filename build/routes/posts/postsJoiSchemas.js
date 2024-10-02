"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostsSchema = exports.postsSchema = exports.updateCommentSchema = exports.commentsSchema = void 0;
var joi_1 = __importDefault(require("joi"));
var mongodb_1 = require("mongodb");
exports.commentsSchema = joi_1.default.object({
    content: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
    _id: joi_1.default.object().default(function () { return new mongodb_1.ObjectId(); }),
});
exports.updateCommentSchema = joi_1.default.object({
    content: joi_1.default.string().required(),
    updatedAt: joi_1.default.date().default(function () { return new Date(); }),
});
exports.postsSchema = joi_1.default.object({
    content: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
    createdAt: joi_1.default.date().default(function () { return new Date(); }),
    comments: joi_1.default.array().items(exports.commentsSchema).optional(),
});
exports.updatePostsSchema = joi_1.default.object({
    $set: joi_1.default
        .object({
        content: joi_1.default.string().required(),
        userId: joi_1.default.string().optional(),
        updatedAt: joi_1.default.date().optional().default(new Date()),
        comments: joi_1.default.array().items(exports.commentsSchema).optional(),
    })
        .optional(),
    $push: joi_1.default
        .object({
        comments: exports.commentsSchema.required(),
    })
        .optional(),
    $pull: joi_1.default
        .object({
        comments: joi_1.default.object({
            _id: joi_1.default.string().required(),
        }),
    })
        .optional(),
});
