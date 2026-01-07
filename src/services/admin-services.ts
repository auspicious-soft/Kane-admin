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

export const deleteOffer = async (route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.delete(route)
}


// -------------------- Users Page ---------------------------

export const getAllUsers =  async(route:string) =>{
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

export const getAllBlockedUsers =  async(route:string) =>{
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}


export const getUserById =  async(route:string) =>{
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

export const blockUser = async (route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.put(route, payload)
}

export const getUserOfferAndRedemptionHistory =  async(route:string) =>{
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

export const UserDetailsWithBarCode =  async(route:string) =>{
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

export const ApplyUserOffer = async (route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route, payload)
}
export const ApplyUserCoupon = async (route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route, payload)
}

// ----------------------- Policies Page ---------------------------

export const createPolicies = async(route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route, payload)
}

export const GetPolicies = async(route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}



// ----------------------- Achievements Page --------------------------

export const createAchievement = async(route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route,payload)
}

export const getAllAchievements = async(route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

export const getAchievementById = async(route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

export const updateAchievementById = async (route:string, payload:any)=>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.put(route,payload)
}

export const deleteAchivementById = async(route:string)=>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.delete(route)
}


//  -------------------- Coupon Page -------------------------------


export const createCoupon = async(route:string, payload:any) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.post(route,payload)
}


export const getAllCoupons = async(route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

export const getCouponById = async(route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

export const updateCouponById = async (route:string, payload:any)=>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.put(route,payload)
}

export const deleteCouponById = async(route:string)=>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.delete(route)
}

// ------------------ DashBoard ----------------------

export const getDashboardData = async(route:string) =>{
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.get(route)
}

