"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseLevelSchema = exports.courseStatusSchema = exports.courseSchema = exports.Categories = void 0;
const zod_1 = require("zod");
exports.Categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "AI",
    "Machine Learning",
    "Blockchain",
    "Cybersecurity",
    "DevOps",
    "Cloud Computing",
    "Game Development",
    "Design",
    "Marketing",
    "Business",
    "Personal Development",
    "Health and Fitness",
    "Music",
    "Photography",
    "Writing",
    "Language Learning",
];
exports.courseSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, { message: "Title must be at least 3 characters" })
        .max(100, { message: "Title must be less than 100 characters" }),
    description: zod_1.z
        .string()
        .min(3, { message: "Description must be at least 3 characters" }),
    fileKey: zod_1.z.string().min(1, { message: "Thumbnail is required" }),
    price: zod_1.z.string().min(1, { message: "Price must be at least 1" }),
    duration: zod_1.z
        .string()
        .min(1, { message: "Duration must be at least 1" })
        .max(500, { message: "Duration must be less than 500" }),
    level: zod_1.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    category: zod_1.z.enum(exports.Categories, { message: "Category is required" }),
    smallDescription: zod_1.z
        .string()
        .min(3, { message: "Small description must be at least 3 characters" })
        .max(200, {
        message: "Small description must be less than 200 characters",
    }),
    slug: zod_1.z.string().min(3, { message: "Slug must be at least 3 characters" }),
    status: zod_1.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
        message: "Status is required",
    }),
});
exports.courseStatusSchema = ["DRAFT", "PUBLISHED", "ARCHIVED"];
exports.courseLevelSchema = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
