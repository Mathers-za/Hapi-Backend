"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.userCreateSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.userCreateSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default
        .string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/),
    passwordConfirm: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
});
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().optional(),
    lastName: joi_1.default.string().optional().min(1),
    email: joi_1.default.string().email().optional().empty(""),
    password: joi_1.default
        .string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/),
});
