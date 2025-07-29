"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3DeleteSchema = exports.fileUploadSchema = void 0;
const zod_1 = require("zod");
exports.fileUploadSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1, { message: "File name is required" }),
    contentType: zod_1.z.string().min(1, { message: "Content type is required" }),
    size: zod_1.z.number().min(1, { message: "File size is required" }),
    isImage: zod_1.z.boolean(),
});
exports.s3DeleteSchema = zod_1.z.object({
    key: zod_1.z.string().min(1, { message: "Key is required" }),
});
