import httpClient from './httpClient';
import { API_END_POINTS } from './httpEndpoints';

class Client {
  user = {
    services: {
      service_category: {
        getById: (params: any) =>
          httpClient.get(API_END_POINTS.services.service_category.getById, params),
        getAll: (params: any) =>
          httpClient.get(API_END_POINTS.services.service_category.getAll, params),
        post: (params: any) =>
          httpClient.post(API_END_POINTS.services.service_category.post, params),
        put: (params: any, data: any) =>
          httpClient.update(API_END_POINTS.services.service_category.put, params, data),
        delete: (params: any) =>
          httpClient.delete(API_END_POINTS.services.service_category.delete, params),
      },
      service: {
        post: (data: any) => httpClient.post(API_END_POINTS.services.service.post, data),
        getById: (params: any) => httpClient.get(API_END_POINTS.services.service.getById, params),
        getAll: (params: any) => httpClient.get(API_END_POINTS.services.service.get, params),
        put: (params: any, data: any) =>
          httpClient.update(API_END_POINTS.services.service.put, params, data),
        patch: (params: any, data: any) =>
          httpClient.patch(API_END_POINTS.services.service.patch, params, data),
      },
    },
    spare_parts: {
      getAll: (params: any) => httpClient.get(API_END_POINTS.spare_parts.getAll, params),
      post: (data: any) => httpClient.post(API_END_POINTS.spare_parts.post, data),
      getById: (params: any) => httpClient.get(API_END_POINTS.spare_parts.getById, params),
      put: (params: any, data: any) =>
        httpClient.update(API_END_POINTS.spare_parts.put, params, data),
      delete: (params: any) => httpClient.delete(API_END_POINTS.spare_parts.delete, params),
      patch: (params: any, data: any) =>
        httpClient.patch(API_END_POINTS.spare_parts.patch, params, data),
    },
    booking_cart: {
      post: (data: any) => httpClient.post(API_END_POINTS.booking_cart.post, data),
      getAll: (params: any) => httpClient.get(API_END_POINTS.booking_cart.get, params),
      delete: (params: any) => httpClient.delete(API_END_POINTS.booking_cart.delete, params),
      put: (params: any, data: any) =>
        httpClient.update(API_END_POINTS.booking_cart.put, params, data),
      getById: (params: any) => httpClient.get(API_END_POINTS.booking_cart.getById, params),
      deleteProduct: (data: any) =>
        httpClient.delete(
          API_END_POINTS.booking_cart.deleteProduct
            .replace(':cartId', data?.cartId)
            .replace(':productId', data?.productId),
          {}
        ),
      deleteService: (data: any) =>
        httpClient.delete(
          API_END_POINTS.booking_cart.deleteService
            .replace(':cartId', data?.cartId)
            .replace(':serviceId', data?.serviceId),
          {}
        ),
    },
    service_bookings: {
      post: (data: any) => httpClient.post(API_END_POINTS.service_bookings.post, data),
      getAll: (params: any) => httpClient.get(API_END_POINTS.service_bookings.get, params),
      put: (params: any, data: any) =>
        httpClient.update(API_END_POINTS.service_bookings.put, params, data),
      patch: (params: any, data: any) =>
        httpClient.patch(API_END_POINTS.service_bookings.patch, params, data),
    },
    auth: {
      login: (data: any) => httpClient.post(API_END_POINTS.auth.post_login, data),
      signUp: (data: any) => httpClient.post(API_END_POINTS.auth.post_signup, data),
      forgotPassword: (data: any) =>
        httpClient.post(API_END_POINTS.auth.post_forgot_password, data),
      resetPassword: (data: any) => httpClient.post(API_END_POINTS.auth.post_reset_password, data),
      verify_otp: (data: any) => httpClient.post(API_END_POINTS.auth.post_verify_otp, data),
      resend_otp: (data: any) => httpClient.post(API_END_POINTS.auth.post_resend_otp, data),
      getUserProfile: (params: any) => httpClient.get(API_END_POINTS.auth.get, params),
      updateUserProfile: (data: any) => httpClient.update(API_END_POINTS.auth.put, data),
    },
    notification: {
      getAll: (params: any) => httpClient.get(API_END_POINTS.notification.getAll, params),
      getById: (params: any) =>
        httpClient.get(
          API_END_POINTS.notification.getById.replace(':userId', params?.userId),
          params
        ),
    },
    bookings: {
      getAll: (params?: any) => httpClient.get(API_END_POINTS.bookings.getAll, params),
      postProduct: (params: any) => httpClient.post(API_END_POINTS.bookings.postProduct, params),
      postService: (params: any) => httpClient.post(API_END_POINTS.bookings.postService, params),
      getServiceInvoice: (params: any) =>
        httpClient.fileGet(
          API_END_POINTS.bookings.getServiceInvoice.replace(':uuid', params?.uuid),
          params
        ),
      getProductInvoice: (params: any) =>
        httpClient.fileGet(
          API_END_POINTS.bookings.getProductInvoice.replace(':uuid', params?.uuid),
          params
        ),
    },
    sos: {
      post: (data: any) => httpClient.post(API_END_POINTS.sos.Post, data),
      get: () => httpClient.get(API_END_POINTS.sos.GetAll),
      getByUser: (params: any) => httpClient.get(API_END_POINTS.sos.GetByUser.replace(':id',params)) 
  
    },
    announcement: {
      get: (params: any) => httpClient.get(API_END_POINTS.announcement.Get, params),
    },
   
    enquiry: {
      post: (data: any) => httpClient.post(API_END_POINTS.enquiry.Post, data),
    },
    upload: {
      post: (params: any, data: any) =>
        httpClient.uploadFile(API_END_POINTS.upload.post.replace(':userId', params?.userId), data),
    },

    externalVehicle: {
			getMakes: () =>
				httpClient.get(API_END_POINTS.externalVehicle.getMakes),

				getModelsByMake: (make: string) =>
				httpClient.get(
					API_END_POINTS.externalVehicle.getModelsByMake.replace(
						':make',
						encodeURIComponent(make)
					)
				),
		},

    uploadMultiple: {
      post: (params: any, data: any) =>
        httpClient.uploadFile(
          API_END_POINTS.upload.postMultiImage.replace(':userId', params?.userId),
          data
        ),
    },
  };
    
}

export default Client;
