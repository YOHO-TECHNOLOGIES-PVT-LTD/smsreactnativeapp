import Client from '~/api';

export const postSOSData = async (data: any) => {
  try {
    const response = await new Client().user.sos.post(data);
    if (response) return response;
  } catch (error) {
    console.log(error);
  }
};


export const getSos = async (params:string) => {
  console.log("entered into service getsos")
  try{
    const response = await new Client().user.sos.getByUser(params);
    console.log("service sos",response)
    return response;
  }catch(error){
    console.log(error)
  }

}

export const getAllSOS = async () => {
  try {
    const response = await new Client().user.sos.get();
    return response;
    } catch (error) {
    console.log(error)
  }
}
