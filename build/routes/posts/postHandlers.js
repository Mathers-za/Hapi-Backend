"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisCachingOfPosts = exports.getUsersPosts = exports.updatePostComment = exports.deletePost = exports.getArrayOfFriendsPosts = exports.getPost = exports.updatePost = exports.createPost = void 0;
var mongodb_1 = require("mongodb");
var db_config_1 = require("../../db-config");
var redisfns_1 = require("../../untily-functions/redisfns");
var postsCollection = db_config_1.db.collection("posts");
var createPost = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, postsCollection.insertOne(request.payload)];
            case 1:
                _a.sent();
                return [2 /*return*/, h.response({ success: true }).code(201)];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                h.response({
                    success: false,
                    message: "Internal server error",
                    error: error_1.message,
                }).code(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
var updatePost = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updatedDocument, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = new mongodb_1.ObjectId(request.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postsCollection.findOneAndUpdate({ _id: id }, request.payload, { returnDocument: "after" })];
            case 2:
                updatedDocument = _a.sent();
                return [2 /*return*/, h.response({ success: true, data: updatedDocument }).code(200)];
            case 3:
                error_2 = _a.sent();
                h.response({
                    success: false,
                    message: "Internal server error",
                    error: error_2.message,
                }).code(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updatePost = updatePost;
var getPost = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = new mongodb_1.ObjectId(request.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postsCollection.findOne({ _id: id })];
            case 2:
                post = _a.sent();
                return [2 /*return*/, h.response({ success: true, data: post }).code(200)];
            case 3:
                error_3 = _a.sent();
                console.error(error_3);
                return [2 /*return*/, h
                        .response({
                        success: false,
                        message: "Internal server error",
                        error: error_3.message,
                    })
                        .code(500)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPost = getPost;
var getArrayOfFriendsPosts = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, pageSize, friendsArray, offset, posts;
    return __generator(this, function (_b) {
        _a = request.payload, page = _a.page, pageSize = _a.pageSize, friendsArray = _a.friendsArray;
        offset = page - 1 * 10;
        try {
            posts = postsCollection
                .aggregate([
                {
                    $match: {
                        userId: { $in: friendsArray },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        user: 1,
                        comments: 1,
                    },
                },
                {
                    $unwind: "$user",
                },
                { $addFields: { commentsCount: { $size: "$comments" } } },
                {
                    $sort: {
                        date: -1,
                    },
                },
                { $skip: offset },
                {
                    $limit: pageSize,
                },
            ])
                .toArray();
            return [2 /*return*/, h.response({ success: true, data: posts }).code(200)];
        }
        catch (error) {
            console.error(error);
            return [2 /*return*/, h
                    .response({
                    success: false,
                    message: "Internal server error",
                    error: error.message,
                })
                    .code(500)];
        }
        return [2 /*return*/];
    });
}); };
exports.getArrayOfFriendsPosts = getArrayOfFriendsPosts;
var deletePost = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = new mongodb_1.ObjectId(request.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                result = postsCollection.deleteOne({ _id: id });
                return [4 /*yield*/, result];
            case 2:
                if ((_a.sent()).deletedCount > 0) {
                    return [2 /*return*/, h.response({ success: true }).code(200)];
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error(error_4);
                return [2 /*return*/, h
                        .response({
                        success: false,
                        message: "Internal server error",
                        error: error_4.message,
                    })
                        .code(500)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
var updatePostComment = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, commentId, content, update, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.payload, postId = _a.postId, commentId = _a.commentId, content = _a.content;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postsCollection.findOneAndUpdate({ _id: postId, "comments._id": commentId }, {
                        $set: { "comments.$.content": content },
                    }, {
                        returnDocument: "after",
                    })];
            case 2:
                update = _b.sent();
                return [2 /*return*/, h.response({ success: true, data: update }).code(200)];
            case 3:
                error_5 = _b.sent();
                h.response({
                    success: false,
                    message: "Internal server error",
                    error: error_5.message,
                }).code(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updatePostComment = updatePostComment;
var getUsersPosts = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, page, pageSize, offset, posts, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = new mongodb_1.ObjectId(request.params.userId);
                page = Number(request.query.page);
                pageSize = Number(request.query.pageSize);
                offset = (page - 1) * pageSize;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, postsCollection
                        .aggregate([
                        {
                            $match: { userId: userId },
                        },
                        {
                            $sort: { date: -1 },
                        },
                        {
                            $skip: offset,
                        },
                        {
                            $limit: pageSize,
                        },
                    ])
                        .toArray()];
            case 2:
                posts = _a.sent();
                h.response({ success: true, data: posts }).code(200);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                h.response({
                    success: false,
                    message: "Internal server error",
                    error: error_6.message,
                }).code(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUsersPosts = getUsersPosts;
var redisCachingOfPosts = function (request, h) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = request.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, redisfns_1.getOrSetRedisCache)("posts", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, postsCollection.find().toArray()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
            case 2:
                data = _a.sent();
                return [2 /*return*/, h.response({ success: true, data: data })];
            case 3:
                error_7 = _a.sent();
                return [2 /*return*/, h.response({
                        message: "Internal server error",
                        success: false,
                        error: error_7 instanceof Error ? error_7.message : error_7,
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.redisCachingOfPosts = redisCachingOfPosts;
