import Client from "~/api"

export const createEnquiry = async (data: any) => {
     try{
        const response = await new Client().user.enquiry.post(data);
        return response
        console.log(response);
     }catch(error){
        console.log(error)
     }
}