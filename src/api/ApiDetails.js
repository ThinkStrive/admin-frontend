import { backendUrl } from "../config"









// Backend

// Authentication
export const USER_LOGIN = `${backendUrl}/authentication/login`
export const USER_REGISTER = `${backendUrl}/authentication/register`
export const USER_LOGIN_GOOGLE = `${backendUrl}/authentication/google_login`
export const USER_FORGOT_PASSWORD = `${backendUrl}/authentication/forgot_password`
export const USER_RESET_PASSWORD = `${backendUrl}/authentication/reset_password`


// users
export const GET_ALL_USER = `${backendUrl}/users`
export const GET_SINGLE_USER = `${backendUrl}/users`
export const ADD_NEW_USER = `${backendUrl}/users`
export const UPDATE_SINGLE_USER = `${backendUrl}/users`
export const DELETE_SINGLE_USER = `${backendUrl}/users`


//Feedback
export const GET_ALL_FEEDBACK = `${backendUrl}/feedback/get`


// Payment
export const NEW_PAYMENT_USER = `${backendUrl}/payment`
export const GET_ALL_PAYMENTS = `${backendUrl}/payment`
export const HISTORY_DETAILS = "https://admin-be-dev.onrender.com/paid-history"
















