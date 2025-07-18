import Client from '~/api';

export const getAllServiceBookings = async (data: any) => {
  try {
    const response = await new Client().user.service_bookings.getAll(data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.log('Error fetching booking cart items:', error);
    return null;
  }
};

export const addServiceBooking = async (data: any) => {
  try {
    const response = await new Client().user.service_bookings.post(data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.log('Error adding booking cart item:', error);
    return null;
  }
};

export const updateServiceBooking = async (id: any, data: any) => {
  try {
    const response = await new Client().user.service_bookings.put(id, data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllBookingsCartItems = async (data: any) => {
  try {
    const response = await new Client().user.bookings.getAll(data);
    if (response) {
      return response;
    }
  } catch (error) {
    console.log('Error fetching booking cart items:', error);
    return null;
  }
};

export const addServiceCartItems = async (data: any) => {
  try {
    const response = await new Client().user.bookings.postService(data);
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.log('Error fetching service cart items:', error);
    return null;
  }
};

export const addSparePartCartItems = async (data: any) => {
  try {
    const response = await new Client().user.bookings.postProduct(data);
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.log('Error fetching spare part cart items:', error);
    return null;
  }
};
