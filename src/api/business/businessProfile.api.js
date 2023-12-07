import camelize from 'camelize-ts'
import axiosInstance from 'api'

const BUSINESS_BASE_PATH = '/v2/business'

const fetchBusinessProfile = async () => {
  return await axiosInstance.get(`${BUSINESS_BASE_PATH}`).then(({ data }) => camelize(data.result))
}

const updateBusinessFirstLogin = async (firstLogin) => {
  return await axiosInstance
    .put(`${BUSINESS_BASE_PATH}/update-first-login`, { first_login: firstLogin })
    .then(({ data }) => camelize(data.result))
}

export { fetchBusinessProfile, updateBusinessFirstLogin }
