import camelize from 'camelize-ts'
import { stringifyUrl } from 'query-string'
import axiosInstance from 'api'

const BUSINESS_CAMPAIGNS_BASE_PATH = '/v2/business/campaigns'

const fetchCampaignList = async (params = {}) => {
  return await axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_CAMPAIGNS_BASE_PATH}`,
        query: params,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const fetchCampaignDetail = async (campaignId) => {
  return await axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_CAMPAIGNS_BASE_PATH}/${campaignId}`,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const createCampaign = async (values = {}) => {
  return await axiosInstance.post(`${BUSINESS_CAMPAIGNS_BASE_PATH}`, values).then(({ data }) => camelize(data.result))
}

const updateCampaign = async (campaignId, values = {}) => {
  return await axiosInstance
    .patch(`${BUSINESS_CAMPAIGNS_BASE_PATH}/${campaignId}`, values)
    .then(({ data }) => camelize(data.result))
}

const deleteCampaign = async (campaignId) => {
  return await axiosInstance
    .delete(
      stringifyUrl({
        url: `${BUSINESS_CAMPAIGNS_BASE_PATH}/${campaignId}`,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const fetchPositionCampaignResult = async (campaignId, positionId) => {
  return await axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_CAMPAIGNS_BASE_PATH}/result/${campaignId}/${positionId}`,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const cancelCampaign = async (campaignId) => {
  return await axiosInstance
    .put(`${BUSINESS_CAMPAIGNS_BASE_PATH}/${campaignId}/cancel`)
    .then(({ data }) => camelize(data.result))
}

const fetchCampaignByPositionId = (positionId) => {
  return axiosInstance
    .get(`${BUSINESS_CAMPAIGNS_BASE_PATH}/position/${positionId}`)
    .then(({ data }) => camelize(data.result))
}

const fetchCampaignByTestId = (testId) => {
  return axiosInstance.get(`${BUSINESS_CAMPAIGNS_BASE_PATH}/test/${testId}`).then(({ data }) => camelize(data.result))
}

const fetchCampaignBySurveyId = (surveyId) => {
  return axiosInstance
    .get(`${BUSINESS_CAMPAIGNS_BASE_PATH}/survey/${surveyId}`)
    .then(({ data }) => camelize(data.result))
}

export {
  fetchCampaignList,
  fetchCampaignDetail,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  cancelCampaign,
  fetchPositionCampaignResult,
  fetchCampaignByPositionId,
  fetchCampaignByTestId,
  fetchCampaignBySurveyId,
}
