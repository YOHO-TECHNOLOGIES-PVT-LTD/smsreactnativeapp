import Client from '~/api';

export const getUserProfileDetails = async (params?: any) => {
  try {
    const response = await new Client().user.auth.getUserProfile(params);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.log('Error fetching user profile details:', error);
    return null;
  }
};

export const updateUserProfileDetails = async (data: any) => {
  try {
    const response = await new Client().user.auth.updateUserProfile(data);
     console.log('API Response:', response.data);
    if (response) {
      return response;
    }
  } catch (error) {
    console.log('Error updating user profile details:', error);
    return null;
  }
};
