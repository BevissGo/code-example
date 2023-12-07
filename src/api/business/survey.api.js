import camelize from 'camelize-ts'
import { stringifyUrl } from 'query-string'

import axiosInstance from 'api'

const BUSINESS_SURVEY_BASE_PATH = '/v2/business/survey'

export const fetchSurveyList = () => {
  return axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_SURVEY_BASE_PATH}`,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

export const createSurvey = (values = {}) => {
  return axiosInstance.post(BUSINESS_SURVEY_BASE_PATH, values).then(({ data }) => camelize(data.result))
}

export const archiveSurvey = (id) => {
  return axiosInstance.put(`${BUSINESS_SURVEY_BASE_PATH}/${id}/archive`).then(({ data }) => camelize(data.result))
}

export const updateSurvey = (id, params = {}) => {
  return axiosInstance.patch(`${BUSINESS_SURVEY_BASE_PATH}/${id}`, params).then(({ data }) => camelize(data.result))
}

export const getSurveyById = (id) => {
  return axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_SURVEY_BASE_PATH}/${id}`,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

export const deleteSurvey = (id) => {
  return axiosInstance.delete(`${BUSINESS_SURVEY_BASE_PATH}/${id}`).then(({ data }) => camelize(data.result))
}
