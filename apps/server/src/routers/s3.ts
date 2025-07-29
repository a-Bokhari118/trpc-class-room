import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../lib/trpc";
import { fileUploadSchema, s3DeleteSchema } from "shared";
import { v4 as uuidv4 } from "uuid";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3-clients";

export const s3Router = router({
  getUploadUrl: protectedProcedure
    .input(fileUploadSchema)
    .mutation(async ({ input }) => {
      try {
        const validation = fileUploadSchema.safeParse(input);
        if (!validation.success) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid request body",
          });
        }

        const { fileName, contentType, size } = validation.data;

        const uniqueFileName = `${uuidv4()}-${fileName}`;
        const command = new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
          Key: uniqueFileName,
          ContentType: contentType,
          ContentLength: size,
        });

        const presignedUrl = await getSignedUrl(S3, command, {
          expiresIn: 360,
        });
        const response = {
          presignedUrl,
          key: uniqueFileName,
        };
        return response;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get presigned URL",
        });
      }
    }),

  deleteFile: protectedProcedure
    .input(s3DeleteSchema)
    .mutation(async ({ input }) => {
      try {
        const validation = s3DeleteSchema.safeParse(input);
        if (!validation.success) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid request body",
          });
        }

        const command = new DeleteObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
          Key: validation.data.key,
        });

        await S3.send(command);
        return { message: "File deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),
});
