import { z } from "zod";
export declare const Categories: readonly ["Web Development", "Mobile Development", "Data Science", "AI", "Machine Learning", "Blockchain", "Cybersecurity", "DevOps", "Cloud Computing", "Game Development", "Design", "Marketing", "Business", "Personal Development", "Health and Fitness", "Music", "Photography", "Writing", "Language Learning"];
export declare const courseSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    fileKey: z.ZodString;
    price: z.ZodString;
    duration: z.ZodString;
    level: z.ZodEnum<["BEGINNER", "INTERMEDIATE", "ADVANCED"]>;
    category: z.ZodEnum<["Web Development", "Mobile Development", "Data Science", "AI", "Machine Learning", "Blockchain", "Cybersecurity", "DevOps", "Cloud Computing", "Game Development", "Design", "Marketing", "Business", "Personal Development", "Health and Fitness", "Music", "Photography", "Writing", "Language Learning"]>;
    smallDescription: z.ZodString;
    slug: z.ZodString;
    status: z.ZodEnum<["DRAFT", "PUBLISHED", "ARCHIVED"]>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    fileKey: string;
    price: string;
    duration: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    category: "Web Development" | "Mobile Development" | "Data Science" | "AI" | "Machine Learning" | "Blockchain" | "Cybersecurity" | "DevOps" | "Cloud Computing" | "Game Development" | "Design" | "Marketing" | "Business" | "Personal Development" | "Health and Fitness" | "Music" | "Photography" | "Writing" | "Language Learning";
    smallDescription: string;
    slug: string;
}, {
    title: string;
    description: string;
    fileKey: string;
    price: string;
    duration: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    category: "Web Development" | "Mobile Development" | "Data Science" | "AI" | "Machine Learning" | "Blockchain" | "Cybersecurity" | "DevOps" | "Cloud Computing" | "Game Development" | "Design" | "Marketing" | "Business" | "Personal Development" | "Health and Fitness" | "Music" | "Photography" | "Writing" | "Language Learning";
    smallDescription: string;
    slug: string;
}>;
export type CourseSchemaType = z.infer<typeof courseSchema>;
export declare const courseStatusSchema: string[];
export declare const courseLevelSchema: string[];
