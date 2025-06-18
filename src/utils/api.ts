// import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// import { getSession } from 'next-auth/react';

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// export interface ApiResponse<T = any> {
//   data: T;
//   success: boolean;
//   status: number;
// }

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Updated to use NextAuth session token
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     // Get session from NextAuth
//     const session = await getSession();
    
//     if (session?.accessToken) {
//       config.headers.Authorization = `Bearer ${session.accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Let response interceptor pass raw Axios response
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error) => {
//     const status = error.response?.status || 500;
//     const message = error.response?.data?.message || error.message;

//     console.error('API Error:', message);

//     return Promise.reject({
//       success: false,
//       status,
//       message,
//       error: error.response?.data || {},
//     });
//   }
// );

// // ✅ API wrapper functions with ApiResponse return type
// export const getApi = async <T = any>(
//   url: string,
//   config: AxiosRequestConfig = {}
// ): Promise<ApiResponse<T>> => {
//   try {
//     const response = await axiosInstance.get<T>(url, config);
//     return {
//       data: response.data,
//       success: true,
//       status: response.status,
//     };
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };

// export const postApi = async <T = any>(
//   url: string,
//   data: any,
//   config: AxiosRequestConfig = {}
// ): Promise<ApiResponse<T>> => {
//   try {
//     const response = await axiosInstance.post<T>(url, data, config);
//     return {
//       data: response.data,
//       success: true,
//       status: response.status,
//     };
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };

// export const putApi = async <T = any>(
//   url: string,
//   data: any,
//   config: AxiosRequestConfig = {}
// ): Promise<ApiResponse<T>> => {
//   try {
//     const response = await axiosInstance.put<T>(url, data, config);
//     return {
//       data: response.data,
//       success: true,
//       status: response.status,
//     };
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };

// export const patchApi = async <T = any>(
//   url: string,
//   data: any,
//   config: AxiosRequestConfig = {}
// ): Promise<ApiResponse<T>> => {
//   try {
//     const response = await axiosInstance.patch<T>(url, data, config);
//     return {
//       data: response.data,
//       success: true,
//       status: response.status,
//     };
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };

// export const deleteApi = async <T = any>(
//   url: string,
//   config: AxiosRequestConfig = {}
// ): Promise<ApiResponse<T>> => {
//   try {
//     const response = await axiosInstance.delete<T>(url, config);
//     return {
//       data: response.data,
//       success: true,
//       status: response.status,
//     };
//   } catch (error) {
//     handleError(error);
//     throw error;
//   }
// };

// // ✅ Central error handling with narrowing
// function handleError(error: unknown) {
//   if (axios.isAxiosError(error)) {
//     console.error('Axios Error:', error.response?.data?.message || error.message);
//   } else {
//     console.error('Unknown Error:', (error as Error).message);
//   }
// }
