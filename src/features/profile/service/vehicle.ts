import Client from "../../../api/index";

const client = new Client();

export const fetchMakes = async () => {
  try {
    const res = await client.user.externalVehicle.getMakes();
    console.log(" COMPANY ::: ",res);
    
    return res; 
  } catch (error) {
    console.error('Failed to load car makes', error);
    return [];
  }
};

export const fetchModels = async (make: string) => {
  const res: any = await client.user.externalVehicle.getModelsByMake(make);
  console.log(" model :",res);
  
  return res.Results;
};



