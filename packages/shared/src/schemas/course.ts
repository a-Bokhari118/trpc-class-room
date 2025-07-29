import { z } from "zod";

export const Categories = [
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
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
  fileKey: z.string().min(1, { message: "Thumbnail is required" }),
  price: z.string().min(1, { message: "Price must be at least 1" }),
  duration: z
    .string()
    .min(1, { message: "Duration must be at least 1" })
    .max(500, { message: "Duration must be less than 500" }),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const),
  category: z.enum(Categories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters" })
    .max(200, {
      message: "Small description must be less than 200 characters",
    }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"] as const, {
    message: "Status is required",
  }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

export const courseStatusSchema = ["DRAFT", "PUBLISHED", "ARCHIVED"];
export const courseLevelSchema = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
