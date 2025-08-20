import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// const backEndUrl: string = 'https://sms-node-backend-17xb.onrender.com';
const backEndUrl: string = 'http://192.168.1.10:3000';

const Axios = axios.create({
  baseURL: backEndUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

let logoutCallback: any = null;
export const setLogoutCallback = (callback: any) => {
  logoutCallback = callback;
};

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error?.response &&
      error?.response?.status === 401 &&
      error?.response?.data?.status === 'session_expired'
    ) {
      Alert.alert('Session expired. Logging out...');

      // Call the logout callback to navigate
      if (logoutCallback) {
        logoutCallback();
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('HTTP Error:', error?.response);
    }
    // if (
    //   (error?.response?.data?.status && error?.response?.data?.message === 'Password not match') ||
    //   error?.response?.data?.message === 'User not found with these credentials'
    // ) {
    //   Alert.alert('Failed', error?.response?.data?.message);
    // }
    return Promise.reject(error);
  }
);

class HttpClient {
  async get<T = any>(url: string, params?: Record<string, any>) {
    const response = await Axios.get<T>(url, {
      params,
    });
    return response.data;
  }

  async post<T = any>(url: string, data: any) {
    const response = await Axios.post<T>(url, data);
    return response.data;
  }

  async update<T = any>(url: string, params: Record<string, any>, data: any) {
    const response = await Axios.put<T>(url, data, { params });
    return response.data;
  }

  async patch<T = any>(url: string, params: Record<string, any>, data: any) {
    const response = await Axios.patch<T>(url, data, { params });
    return response.data;
  }

  async delete<T = any>(url: string, params: Record<string, any>) {
    const response = await Axios.delete<T>(url, { params });
    return response.data;
  }

  async fileGet(url: string) {
    const response = await Axios.get(url, {
      responseType: 'blob', // On RN, this may be a base64 string or binary
    });
    return response.data;
  }

  async uploadFile<T = any>(url: string, data: FormData) {
    const response = await Axios.post<T>(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new HttpClient();
