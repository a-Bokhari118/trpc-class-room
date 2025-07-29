import { z } from "zod";

export const lessonSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  courseId: z.string().uuid({ message: "Invalid Course ID" }),
  chapterId: z.string().uuid({ message: "Invalid Chapter ID" }),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;
