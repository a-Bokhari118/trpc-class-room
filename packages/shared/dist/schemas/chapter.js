"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterSchema = void 0;
const zod_1 = require("zod");
exports.chapterSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: "Name must be at least 3 characters" }),
    courseId: zod_1.z.string().uuid({ message: "Invalid Course ID" }),
});
