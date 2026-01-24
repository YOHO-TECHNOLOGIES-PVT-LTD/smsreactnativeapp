import Client from '../../api';

interface PostRatingPayload {
  cartId: string;
  rating: number;
}

export const postrating = async (data: PostRatingPayload) => {
  try {
    const response = await new Client().user.rating.post(data);
    return response; 
  } catch (error) {
    console.error("Error submitting rating:", error);
  }
};

export const getrating = async (userId: string) => {
  try {
    const response = await new Client().user.rating.get({
      userId,
    });
    return response;
  } catch (error) {
    console.error("Error fetching rating data:", error);
  }
};

interface ProductRatingPayload {
  userId: string;
  rating: number;
  productId: string; 
  review?: string;   
}

export const individualproductrating = async (data: ProductRatingPayload) => {
  try {
    const { productId, ...body } = data; 
    const response = await new Client().user.IndividualProductRating.post(
      body,        
      productId    
    );
    return response;
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw error;
  }
};

export const individualratinggetting = async () => {
  try {
    const response = await new Client().user.IndividualProductRating.get()
    console.log(" Rating in services :",response)
    return response;
  } catch (error) {
    console.error("Error fetching rating data:", error);
  }
};
