import Client from '~/api';

export const getAllSpareParts = async (data: string) => {
  try {
    const response = await new Client().user.spare_parts.getAll(data);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSparePartById = async (id: string) => {
  try {
    const response = await new Client().user.spare_parts.getById(id);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
