const BackEndUrl = 'https://sms-node-backend.onrender.com/';

export const getImageUrl = (imageKey: string | null | undefined): string => {
  return imageKey ? `${BackEndUrl}${imageKey}` : '';
};

export const getFileUrl = (fileKey: string | null | undefined): string => {
  return fileKey ? `${BackEndUrl}${fileKey}` : '';
};
