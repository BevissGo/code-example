import config from 'configs'
import { Auth } from 'constants/actionTypes'
import { getValueFromStorage, removeValueFromStorage } from 'utils'

const initialState = {
  isAuthenticated: !!getValueFromStorage(config.authentication.NORMAL_USER_ACCESS_TOKEN_KEY),
  isBusinessAuthenticated: !!getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY),
  loadingAuth: false,
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case Auth.REQUEST_AUTH_LOGIN:
      return { ...state, loadingAuth: true }
    case Auth.AUTH_LOGIN:
      return { ...state, isAuthenticated: true, loadingAuth: false }
    case Auth.FAIL_REQUEST_AUTH:
      return { ...state, loadingAuth: false }
    case Auth.AUTH_LOGOUT:
      return { ...state, isAuthenticated: false }
    case Auth.REQUEST_BUSINESS_LOGIN:
      return { ...state, loadingAuth: true }
    case Auth.BUSINESS_LOGIN:
      return { ...state, isBusinessAuthenticated: true, loadingAuth: false }
    case Auth.BUSINESS_LOGOUT: {
      removeValueFromStorage(config.authentication.AFFINDA_API_KEY)
      removeValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
      return { ...state, isBusinessAuthenticated: false }
    }
    case Auth.REQUEST_BUSINESS_RESET_PASSWORD:
      return { ...state, loadingAuth: true }
    case Auth.BUSINESS_RESET_PASSWORD:
      return { ...state, loadingAuth: false }
    case Auth.FAIL_REQUEST_BUSINESS_PASSWORD:
      return { ...state, loadingAuth: false }
    default:
      return state
  }
}

export default auth
