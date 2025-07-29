import { z } from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean(),
});

export const s3DeleteSchema = z.object({
  key: z.string().min(1, { message: "Key is required" }),
});

export type FileUploadSchema = z.infer<typeof fileUploadSchema>;
export type S3DeleteSchema = z.infer<typeof s3DeleteSchema>;
