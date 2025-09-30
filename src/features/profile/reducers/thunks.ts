import { getUserProfileDetails } from '../service';
import { getProfile } from './ProfileSlice';

export const getProfileDetailsThunk = (params: any) => async (dispatch: any) => {
  try {
    const response = await getUserProfileDetails(params);
    if (response) {
      dispatch(getProfile(response));
    }
  } catch (error) {
    console.log(error);
  }
};
