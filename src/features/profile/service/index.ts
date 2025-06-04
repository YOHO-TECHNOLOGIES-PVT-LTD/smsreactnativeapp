import Client from '~/api';

export const getUserProfileDetails = async (params: any) => {
  try {
    const response = await new Client().user.auth.getUserProfile(params);
    if (response) {
      return response?.data;
    } else {
      throw new Error('Failed to fetch user profile details');
    }
  } catch (error) {
    console.error('Error fetching user profile details:', error);
    return null;
  }
};

export const updateUserProfileDetails = async (params: any, data: any) => {
  try {
    const response = await new Client().user.auth.updateUserProfile(params, data);
    if (response) {
      return response?.data;
    } else {
      throw new Error('Failed to update user profile details');
    }
  } catch (error) {
    console.error('Error updating user profile details:', error);
    return null;
  }
};
