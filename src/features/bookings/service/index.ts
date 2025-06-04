import Client from '~/api';

export const getAllServiceBookings = async (data: string) => {
  try {
    const response = await new Client().user.service_bookings.getAll(data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking cart items:', error);
    return null;
  }
};

export const addServiceBooking = async (data: string) => {
  try {
    const response = await new Client().user.service_bookings.post(data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error('Error adding booking cart item:', error);
    return null;
  }
};

export const updateServiceBooking = async (id: any, data: string) => {
  try {
    const response = await new Client().user.service_bookings.put(id, data);
    if (response) {
      return response?.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
