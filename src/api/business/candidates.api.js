import camelize from 'camelize-ts'
import { stringifyUrl } from 'query-string'

import axiosInstance from 'api'

const BUSINESS_CANDIDATE_BASE_PATH = '/v2/business/candidates'

const fetchMostRecentCandidates = async (ctx, params = {}) => {
  return axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_CANDIDATE_BASE_PATH}/most-recent`,
        query: params,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const fetchActivityCandidates = async (ctx) => {
  const { location, university, page = 1, perPage = 10 } = ctx.queryKey[1]
  return axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_CANDIDATE_BASE_PATH}/activity`,
        query: {
          page,
          perPage,
          location,
          university,
        },
      }),
    )
    .then(({ data }) => data.result)
}

const fetchCandidateDetails = async (ctx) => {
  const candidateId = ctx.queryKey[1]

  return axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_CANDIDATE_BASE_PATH}/${candidateId}`,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const fetchCandidateDetailsWithReport = async (ctx) => {
  const candidateId = ctx.queryKey[1]
  const testCategories = ctx.queryKey[2] ?? ['disc', 'iq']

  return axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_CANDIDATE_BASE_PATH}/${candidateId}`,
        query: {
          withTestReport: true,
          testCategories: testCategories,
        },
      }),
    )
    .then(({ data }) => camelize(data.result))
}

const deleteCandidateById = async (candidateId) => {
  return axiosInstance.delete(`${BUSINESS_CANDIDATE_BASE_PATH}/${candidateId}`).then(({ data }) => {
    if (!data.success) {
      throw new Error(data.message)
    }
    return data.result
  })
}

export {
  fetchMostRecentCandidates,
  fetchCandidateDetails,
  fetchCandidateDetailsWithReport,
  fetchActivityCandidates,
  deleteCandidateById,
}
