import Client from '~/api';

export const uploadSingleFileorImage = async (params: any, data: any) => {
  try {
    const response = await new Client().user.upload.post(params, data);
    if (response) {
      return response;
    }
  } catch (error) {
    console.log('Error', error);
  }
};


export const uploadMutlipleFileorImage = async (params: any, data: any) => {
  try {
    const response = await new Client().user.uploadMultiple.post(params, data);
    if (response) {
      return response;
    }
  } catch (error) {
    console.log('Error', error);
  }
};



