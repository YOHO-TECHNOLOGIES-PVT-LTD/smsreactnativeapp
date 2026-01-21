import Client from "../../../api/index";

const client = new Client();

export const fetchMakes = async () => {
  const res: any = await client.externalVehicle.getMakes();
  return res.data.Results;
};

export const fetchModels = async (make: string) => {
  const res: any = await client.externalVehicle.getModelsByMake(make);
  return res.data.Results;
};

export const fetchFuelTypes = async () => {
  const res = await client.vehicle.getFuelTypes(); 
  return res.data; 
};
