import Client from '~/api';

export const getAllNotifications = async (params: any) => {
  try {
    const response = await new Client().user.notification.getAll(params);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return null;
  }
};

export const getNotificationById = async (params: any) => {
  try {
    const response = await new Client().user.notification.getById(params);
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.error('Error fetching notification:', error);
    return null;
  }
};
