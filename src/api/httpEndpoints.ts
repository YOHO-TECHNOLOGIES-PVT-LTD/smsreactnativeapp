export const API_END_POINTS = {
  home: {},

  services: {
    service_category: {
      getById: '/api/admin/category/get/:uuid',
      getAll: '/api/admin/category/getAll',
      post: '/api/admin/category/create',
      put: '/api/admin/category/update/:uuid',
      delete: '/api/admin/category/delete/:uuid',
    },
    service: {
      post: '/api/admin/service/',
      get: '/api/admin/service/',
      getById: '/api/admin/service/:uuid',
      put: '/api/admin/service/:uuid',
      patch: '/api/admin/service/toggle-status/:uuid',
    },
  },

  sos: {
    Post: '/api/sos/add',
    GetAll: '/api/sos/getall',
    Get: '/api/sos/get/:id',
    Put: '/api/sos/update/',
    put: '/api/sos/addlist',
    getsoslis: '/api/sos/soslist',
    updatelist: '/api/sos/updatelist/:id',
    delete: '/api/sos/delete/',
  },

  spare_parts: {
    post: '/api/admin/spareparts/create',
    getById: '/api/admin/spareparts/get/:uuid',
    getAll: '/api/admin/spareparts/getall',
    put: '/api/admin/spareparts/update/:id',
    patch: '/api/admin/spareparts/updatestatus/:id',
    delete: '/api/admin/spareparts/delete/:id',
  },

  booking_cart: {
    post: '/api/customer/cart/',
    get: '/api/customer/cart/',
    getById: '/api/customer/cart/:id',
    put: '/api/customer/cart/:id',
    delete: '/api/customer/:cartId/product/:productId',
    deleteProduct: '/api/customer/cart/:cartId/product/:productId',
    deleteService: '/api/customer/cart/:cartId/service/:serviceId',
  },

  service_bookings: {
    post: '/api/booking/',
    get: '/api/booking/',
    put: '/api/booking/:id',
    patch: '/api/booking/:id/cancel',
  },

  announcement: {
    Post: '/api/announcement/create',
    Get: '/api/announcement/all',
  },
  enquiry: {
    Post: '/api/enquiry/create',
    Get: '/api/enquiry/all',
    Put: '/api/enquiry/update/:uuid',
  },

  auth: {
    post_login: '/api/customer/auth/login',
    post_signup: '/api/customer/auth/register',
    get: '/api/customer/auth/me',
    put: '/api/customer/auth/update',
    post_verify_otp: '/api/customer/auth/verify-otp',
    post_forgot_password: '/api/customer/auth/forget-pass',
    post_resend_otp: '/api/customer/auth/resend-otp',
    post_reset_password: '/api/customer/auth/reset-pass',
  },

  notification: {
    getAll: '/api/notifications/',
    getById: '/api/notifications/user/:userId',
  },

  bookings: {
    getAll: '/api/customer/cartbooking/all',
    postProduct: '/api/customer/cartbooking/product/confirm',
    postService: '/api/customer/cartbooking/service/confirm',
    getProductInvoice: '/api/customer/invoice/product/:uuid',
    getServiceInvoice: '/api/customer/invoice/service/:uuid',
  },
  upload: {
    post: '/api/image/singlefile/:userId',
    postMultiImage: '/api/image/multiplefile/:userId'
  },

  externalVehicle: {
		getMakes: 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json',
		getModelsByMake: 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/:make?format=json',
	},
  
};
