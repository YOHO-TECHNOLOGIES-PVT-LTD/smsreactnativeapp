import Client from '~/api';

export const getAllOffers = async () => {
  try {
    const response = await new Client().user.announcement.get({});
    if (response) {
      return response;
    }
  } catch (error: any) {
    console.error('Error fetching offers:', error.message);
  }
};
