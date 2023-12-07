import { Auth } from 'constants/actionTypes'

export const failRequestAuth = () => ({
  type: Auth.FAIL_REQUEST_AUTH,
})

export const requestAuthLogin = () => ({
  type: Auth.REQUEST_AUTH_LOGIN,
})

export const authLogin = () => ({
  type: Auth.AUTH_LOGIN,
})

export const authLogout = () => ({
  type: Auth.AUTH_LOGOUT,
})

export const requestBusinessLogin = () => ({
  type: Auth.REQUEST_BUSINESS_LOGIN,
})

export const businessLogin = () => ({
  type: Auth.BUSINESS_LOGIN,
})

export const businessLogout = () => ({
  type: Auth.BUSINESS_LOGOUT,
})

export const requestBusinessResetPassword = () => ({
  type: Auth.REQUEST_BUSINESS_RESET_PASSWORD
})

export const businessResetPassword = () => ({
  type: Auth.BUSINESS_RESET_PASSWORD
})

export const failRequestBusinessPassword = () => ({
  type: Auth.FAIL_REQUEST_BUSINESS_PASSWORD
})
