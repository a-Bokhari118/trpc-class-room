export const useConstructUrl = (fileKey: string | undefined): string => {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${fileKey}`;
};
