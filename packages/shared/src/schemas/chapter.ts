import { z } from "zod";

export const chapterSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  courseId: z.string().uuid({ message: "Invalid Course ID" }),
});

export type ChapterSchemaType = z.infer<typeof chapterSchema>;
