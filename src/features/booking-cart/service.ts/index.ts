import Client from '~/api';

export const getAllBookingCartItems = async (data: any) => {
  try {
    const response = await new Client().user.booking_cart.getAll(data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking cart items:', error);
    return null;
  }
};

export const addBookingCartItem = async (data: any) => {
  try {
    const response = await new Client().user.booking_cart.post(data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error adding booking cart item:', error);
    return null;
  }
};

export const deleteBookingCartItem = async (id: any) => {
  try {
    const response = await new Client().user.booking_cart.delete(id);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error deleting booking cart item:', error);
    return null;
  }
};

export const updateBookingCartItem = async (id: any, data: string) => {
  try {
    const response = await new Client().user.booking_cart.put(id, data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error updating booking cart item:', error);
    return null;
  }
};

export const getBookingCartItemById = async (id: any) => {
  try {
    const response = await new Client().user.booking_cart.getById(id);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking cart item by ID:', error);
    return null;
  }
};
