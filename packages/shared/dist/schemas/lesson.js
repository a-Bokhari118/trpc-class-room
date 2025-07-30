"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonSchema = void 0;
const zod_1 = require("zod");
exports.lessonSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: "Name must be at least 3 characters" }),
    courseId: zod_1.z.string().uuid({ message: "Invalid Course ID" }),
    chapterId: zod_1.z.string().uuid({ message: "Invalid Chapter ID" }),
    description: zod_1.z.string().optional(),
    thumbnailKey: zod_1.z.string().optional(),
    videoKey: zod_1.z.string().optional(),
});
//# sourceMappingURL=lesson.js.map