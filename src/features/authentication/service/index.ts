import Client from '~/api';

export const LoginAuthentication = async (data: any) => {
  try {
    const response = await new Client().user.auth.login(data);
    if (response) {
      return response?.data;
    }
  } catch (error: any) {
    console.log('Error during login:', error?.message);
    return null;
  }
};

export const SignUpAuthentication = async (data: any) => {
  try {
    const response = await new Client().user.auth.signUp(data);
    if (response) {
      return response;
    }
  } catch (error: any) {
    console.log('Error during sign up:', error?.message);
    return null;
  }
};

export const ForgotPassword = async (data: any) => {
  try {
    const response = await new Client().user.auth.forgotPassword(data);
    if (response) {
      return response?.data;
    }
  } catch (error: any) {
    console.log('Error during forgot password:', error?.message);
    return null;
  }
};

export const ResetPassword = async (data: any) => {
  try {
    const response = await new Client().user.auth.resetPassword(data);
    if (response) {
      return response?.data;
    }
  } catch (error: any) {
    console.log('Error during reset password:', error?.message);
    return null;
  }
};

export const VerifyOtp = async (data: any) => {
  try {
    const response = await new Client().user.auth.verify_otp(data);
    if (response) {
      return response?.data;
    }
    throw new Error('Failed to verify OTP');
  } catch (error: any) {
    console.log('Error during verify OTP:', error?.message);
    return null;
  }
};

export const ResendOtp = async (data: any) => {
  try {
    const response = await new Client().user.auth.resend_otp(data);
    if (response) {
      return response?.data;
    }
    throw new Error('Failed to resend OTP');
  } catch (error: any) {
    console.log('Error during resend OTP:', error?.message);
    return null;
  }
};
