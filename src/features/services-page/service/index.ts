import Client from '~/api';

//services get all
export const getAllServices = async (data: any) => {
  try {
    const response = await new Client().user.services.service.getAll(data);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

//services get by id
export const getServiceById = async (id: string) => {
  try {
    const response = await new Client().user.services.service.getById(id);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error('Error fetching service by ID:', error);
  }
};

//service category get all
export const getAllServiceCategories = async (data: any) => {
  try {
    const response = await new Client().user.services.service_category.getAll(data);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return null
  }
};

//service category get by id
export const getServiceCategoryById = async (id: string) => {
  try {
    const response = await new Client().user.services.service_category.getById(id);
    if (response) {
      return response?.data;
    }
  } catch (error) {
    console.error('Error fetching service category by ID:', error);
    return null;
  }
};


