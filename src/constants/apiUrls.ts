import { GET } from "@/app/api/auth/[...nextauth]/route";

const API_BASE = `/api`;
const API_BASE_ADMIN = `/api/admin`;
// Auth related endpoints
export const AUTH_URLS = {
  LOGIN: `${API_BASE}/login`,
  LOGOUT: `${API_BASE}/logout`,
  FORGOT_PASSWORD: `${API_BASE}/forgot-password`,
  VERIFY_OTP: `${API_BASE}/verify-otp`,
  NEW_PASSWORD: `${API_BASE}/new-password-otp-verified`,
  PROFILE: `${API_BASE}/profile`,
};

export const RESTAURANT_URLS = {
  CREATE_RESTAURANTS: `${API_BASE_ADMIN}/restaurants`,
  GET_ALL_RESTAURANTS:  (page: number = 1, limit: number = 10) => `${API_BASE_ADMIN}/restaurants?page=${page}&limit=${limit}`,
  GET_SINGLE_RESTAURANT: (id: string) => `${API_BASE_ADMIN}/restaurants/${id}`,
  UPDATE_RESTAURANT: (id: string) => `${API_BASE_ADMIN}/restaurants/${id}`,
  DELETE_RESTAURANT: (id: string) => `${API_BASE_ADMIN}/restaurants/${id}`,
  DELETE_OFFER: (id: string) => `${API_BASE_ADMIN}/restaurants-offers/${id}`,

  CREATE_RESTAURANTS_OFFER: `${API_BASE_ADMIN}/restaurants-offers`,
  GET_ALL_RESTAURANTS_OFFERS: `${API_BASE_ADMIN}/restaurants-offers`,
  GET_SINGLE_RESTAURANT_OFFER: (id: string) =>
    `${API_BASE_ADMIN}/restaurants-offers/${id}`,
  UPDATE_RESTAURANT_OFFER: (id: string) =>
    `${API_BASE_ADMIN}/restaurants-offers/${id}`,

};

export const USER_URLS = {
  GET_ALL_USERS: (page: number = 1, limit: number = 10) =>
    `${API_BASE_ADMIN}/users?page=${page}&limit=${limit}`,
  GET_ALL_BLOCKED_USERS: (page: number = 1, limit: number = 10) =>
    `${API_BASE_ADMIN}/blocked-users?page=${page}&limit=${limit}`,
  GET_SINGLE_USER: (id: string) => `${API_BASE_ADMIN}/users/${id}`,
  BLOCK_USER: `${API_BASE_ADMIN}/block-user`,
  GET_USER_OFFER_AND_REDEMPTION_HISTORY: (
    page: number = 1,
    limit: number = 10,
    id: string,
    type: string
  ) =>
    `${API_BASE_ADMIN}/users/${id}/history?type=${type}&page=${page}&limit=${limit}`,
    GET_USER_WITH_BARCODE:(  id: string,)=>`${API_BASE_ADMIN}/user-barcode/${id}`,
      APPLY_USER_OFFER: `${API_BASE_ADMIN}/offer-history/apply`,
  APPLY_USER_COUPON: `${API_BASE_ADMIN}/coupon-history/apply`,

};

export const POLICIES_URL = {
  CREATE_POLICIES: `${API_BASE_ADMIN}/settings`,
  GET_POLCIIES: (type: string) => `${API_BASE_ADMIN}/settings?type=${type}`,
};

export const ACHIEVEMENT_URLS = {
  CREATE_ACHIVEMENT: `${API_BASE_ADMIN}/achievements`,
  GET_ALL_ACHIEVEMENTS: `${API_BASE_ADMIN}/achievements`,
  GET_SINGLE_ACHIVEMENT: (id: string) => `${API_BASE_ADMIN}/achievements/${id}`,
  UPDATE_ACHIEVEMENT: (id: string) => `${API_BASE_ADMIN}/achievements/${id}`,
  DELETE_ACHIEVEMENT: (id: string) => `${API_BASE_ADMIN}/achievements/${id}`,
};

export const COUPON_URLS = {
  CREATE_COUPON: `${API_BASE_ADMIN}/coupons`,
  GET_ALL_COUPON: `${API_BASE_ADMIN}/coupons`,
  GET_SINGLE_COUPON: (id: string) => `${API_BASE_ADMIN}/coupons/${id}`,
  UPDATE_COUPON: (id: string) => `${API_BASE_ADMIN}/coupons/${id}`,
  DELETE_COUPON: (id: string) => `${API_BASE_ADMIN}/coupons/${id}`,
};

export const DASHBOARD_URL = {
  GET_DASHBOARD_DATA: (page = 1, limit = 10) =>
    `${API_BASE_ADMIN}/dashboard?page=${page}&limit=${limit}`,
};