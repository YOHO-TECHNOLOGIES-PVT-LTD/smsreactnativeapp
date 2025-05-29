const BackEndUrl = process.env.EXPO_PUBLIC_URL ?? ''; // fallback in case it's undefined

export const getImageUrl = (imageKey: string | null | undefined): string => {
  return imageKey ? `${BackEndUrl}${imageKey}` : '';
};

export const getFileUrl = (fileKey: string | null | undefined): string => {
  return fileKey ? `${BackEndUrl}${fileKey}` : '';
};
