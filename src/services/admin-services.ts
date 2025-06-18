import { axiosInstance, getAxiosInstance } from "@/config/axios";
import { AUTH_URLS } from "@/constants/apiUrls";

export const loginService = async (payload: any) => await axiosInstance.post(`${AUTH_URLS.LOGIN}`, { email: payload.email, password: payload.password });
export const forgotPasswordService = async (payload: any) => await axiosInstance.post(`${AUTH_URLS.FORGOT_PASSWORD}`, payload)
export const verifyOtpService = async (payload: any) => await axiosInstance.post(`${AUTH_URLS.VERIFY_OTP}`, payload)
export const resetUserPassword = async (payload: any) => await axiosInstance.patch(`${AUTH_URLS.NEW_PASSWORD}`, payload)
export const logOutService = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route)
}

//----------Profile Page--------------------------
export const getAdminDetails = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const updateAdminDetails = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}
 
// ------------ Resstaurant Page -------------------
export const getAllRestaurants =  async(route:string) =>{
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

export const CreateRestaurant = async(route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route, payload)
}
export const GetRestaurantById = async (route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

export const updateRestaurantById = async (route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.put(route, payload)
}

export const CreateRestaurantOffer = async(route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route, payload)
}

export const updateRestaurantOfferById = async (route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.put(route, payload)
}

export const deleteRestaurant = async (route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.delete(route)
}