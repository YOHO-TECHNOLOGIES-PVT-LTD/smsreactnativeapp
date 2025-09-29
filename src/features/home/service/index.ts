import Client from '~/api';

export const createEnquiry = async (data: any) => {
  try {
    const response = await new Client().user.enquiry.post(data);
    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};
