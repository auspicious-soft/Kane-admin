import axios from "axios";
import { getTokenCustom } from "@/actions";

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    headers: {
        'Content-Type': 'application/json',
        'role' : 'admin'
    }
})

const createAuthInstance = async () => {
    try {
        const token = await getTokenCustom();
        return axios.create({
            baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
            headers: {
                Authorization: `Bearer ${token}`,
                'role' : 'admin', 
                'Content-Type': 'application/json'
            },
        })
    } catch (error) {
        console.error('Error getting token:', error);
        throw error
    }
};


export const getAxiosInstance = async () => {
    return await createAuthInstance()
}


export const getImageClientS3URL = (key: string) => {
   return`${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${key}`
}