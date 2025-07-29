import { z } from "zod";
export declare const lessonSchema: z.ZodObject<{
    name: z.ZodString;
    courseId: z.ZodString;
    chapterId: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    thumbnailKey: z.ZodOptional<z.ZodString>;
    videoKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    courseId: string;
    chapterId: string;
    description?: string | undefined;
    thumbnailKey?: string | undefined;
    videoKey?: string | undefined;
}, {
    name: string;
    courseId: string;
    chapterId: string;
    description?: string | undefined;
    thumbnailKey?: string | undefined;
    videoKey?: string | undefined;
}>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
