

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
  GET_ALL_RESTAURANTS: `${API_BASE_ADMIN}/restaurants`,
  GET_SINGLE_RESTAURANT: (id: string) => `${API_BASE_ADMIN}/restaurants/${id}`,
  UPDATE_RESTAURANT: (id: string) => `${API_BASE_ADMIN}/restaurants/${id}`,
  DELETE_RESTAURANT: (id: string) => `${API_BASE_ADMIN}/restaurants/${id}`,
  CREATE_RESTAURANTS_OFFER:`${API_BASE_ADMIN}/restaurants-offers`,
  GET_ALL_RESTAURANTS_OFFERS: `${API_BASE_ADMIN}/restaurants-offers`,
  GET_SINGLE_RESTAURANT_OFFER: (id: string) => `${API_BASE_ADMIN}/restaurants-offers/${id}`,
  UPDATE_RESTAURANT_OFFER: (id: string) => `${API_BASE_ADMIN}/restaurants-offers/${id}`,
}

