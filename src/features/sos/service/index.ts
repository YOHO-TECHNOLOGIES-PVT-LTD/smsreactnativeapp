import Client from '~/api';

export const postSOSData = async (data: any) => {
  try {
    const response = await new Client().user.sos.post(data);
    if (response) return response;
  } catch (error) {
    console.log(error);
  }
};
