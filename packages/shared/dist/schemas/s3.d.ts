import { z } from "zod";
export declare const fileUploadSchema: z.ZodObject<{
    fileName: z.ZodString;
    contentType: z.ZodString;
    size: z.ZodNumber;
    isImage: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    contentType: string;
    size: number;
    isImage: boolean;
}, {
    fileName: string;
    contentType: string;
    size: number;
    isImage: boolean;
}>;
export declare const s3DeleteSchema: z.ZodObject<{
    key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    key: string;
}, {
    key: string;
}>;
export type FileUploadSchema = z.infer<typeof fileUploadSchema>;
export type S3DeleteSchema = z.infer<typeof s3DeleteSchema>;
