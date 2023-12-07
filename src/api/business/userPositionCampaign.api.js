import { stringifyUrl, stringify } from 'query-string'
import camelize from 'camelize-ts'
import axiosInstance from 'api'

const USER_POSITION_CAMPAIGN_BASE_PATH = '/v2/user-position-campaign'

const editCandidate = async (userId, values) => {
  return await axiosInstance
    .put(
      stringifyUrl({
        url: `${USER_POSITION_CAMPAIGN_BASE_PATH}/users/${userId}`,
      }),
      values,
    )
    .then(({ data }) => camelize(data.result))
}

const deleteCandidate = async (campaignId, positionId, userId) => {
  return await axiosInstance
    .delete(
      stringifyUrl({
        url: `${USER_POSITION_CAMPAIGN_BASE_PATH}/${campaignId}/${positionId}/${userId}`,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const countCandidatesInPosition = async (positionIdList) => {
  return await axiosInstance
    .get(`${USER_POSITION_CAMPAIGN_BASE_PATH}/countCandidates`, {
      params: { positionIdList },
      paramsSerializer: (params) => {
        return stringify(params, { arrayFormat: 'bracket' })
      },
    })
    .then(({ data }) => camelize(data.result))
}

const countCandidatesInPositionWithCampaignId = async (campaignId, positionIdList) => {
  return await axiosInstance
    .get(`${USER_POSITION_CAMPAIGN_BASE_PATH}/countCandidates/${campaignId}`, {
      params: { positionIdList },
      paramsSerializer: (params) => {
        return stringify(params, { arrayFormat: 'bracket' })
      },
    })
    .then(({ data }) => camelize(data.result))
}

const getAllCandidates = async (params = {}) => {
  return await axiosInstance
    .get(`${USER_POSITION_CAMPAIGN_BASE_PATH}`, { params })
    .then(({ data }) => camelize(data.result))
}

const getByCandidateId = async (userId) => {
  return await axiosInstance
    .get(`${USER_POSITION_CAMPAIGN_BASE_PATH}/users/${userId}`)
    .then(({ data }) => camelize(data.result))
}

export {
  editCandidate,
  deleteCandidate,
  countCandidatesInPosition,
  countCandidatesInPositionWithCampaignId,
  getAllCandidates,
  getByCandidateId,
}
