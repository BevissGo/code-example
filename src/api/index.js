import axios from 'axios'
import config from 'configs'
import { getValueFromStorage } from 'utils'

export const host = process.env.REACT_APP_DOMAIN

export const apiHost = `${host}/api`

const instance = axios.create({
  baseURL: apiHost,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (reqConfig) => {
    const accessToken = getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
    if (accessToken) {
      reqConfig.headers.Authorization = `Bearer ${accessToken}`
    }
    return reqConfig
  },
  (error) => {
    return Promise.reject(error)
  },
)

const affindaAxios = axios.create({
  baseURL: 'https://api.affinda.com/v2',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

affindaAxios.interceptors.request.use(
  (reqConfig) => {
    const affindaApiKey = getValueFromStorage(config.authentication.AFFINDA_API_KEY)

    if (affindaApiKey) {
      reqConfig.headers.Authorization = `Bearer ${affindaApiKey}`
    }
    return reqConfig
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
export { affindaAxios }
