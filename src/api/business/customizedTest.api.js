import camelize from 'camelize-ts'

import axiosInstance from 'api'

const BASE_PATH = '/v2/business/customized-tests'

export const fetchCustomizedTestList = () => {
  return axiosInstance.get(`${BASE_PATH}`).then(({ data }) => camelize(data.result))
}

export const archiveTest = (id) => {
  return axiosInstance.put(`${BASE_PATH}/${id}/archive`).then(({ data }) => camelize(data.result))
}

export const fetchTestById = (id) => {
  return axiosInstance.get(`${BASE_PATH}/${id}`).then(({ data }) => data.result)
}

export const updateTest = (id, params) => {
  return axiosInstance.put(`${BASE_PATH}/${id}`, params).then(({ data }) => camelize(data.result))
}

export const createCustomTest = (values) => {
  return axiosInstance.post(`${BASE_PATH}`, values).then(({ data }) => camelize(data.result))
}

export const deleteCustomTest = (id) => {
  return axiosInstance.delete(`${BASE_PATH}/${id}`).then(({ data }) => camelize(data.result))
}
