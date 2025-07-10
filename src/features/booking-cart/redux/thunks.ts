import { getAllBookingCartItems } from '../service';
import { getCartData } from './slices';

export const getBookingCartItems = () => async (dispatch: any) => {
  try {
    const response = await getAllBookingCartItems({});
    dispatch(getCartData(response));
  } catch (error: any) {
    console.log(error.message);
  }
};
