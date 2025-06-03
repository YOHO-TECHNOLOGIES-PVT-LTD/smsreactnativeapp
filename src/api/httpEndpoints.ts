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
  },

  service_bookings: {
    post: '/api/booking/',
    get: '/api/booking/',
    put: '/api/booking/:id',
    patch: '/api/booking/:id/cancel',
  },

  offer: {},

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
  },
};
