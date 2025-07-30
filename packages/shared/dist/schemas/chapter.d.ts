import { z } from "zod";
export declare const chapterSchema: z.ZodObject<{
    name: z.ZodString;
    courseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    courseId: string;
}, {
    name: string;
    courseId: string;
}>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
//# sourceMappingURL=chapter.d.ts.map