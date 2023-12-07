import camelize from 'camelize-ts'
import axiosInstance from 'api'

const POSITION_CAMPAIGN_BASE_PATH = '/v2/position-campaign'

const getAllPositions = () => {
  return axiosInstance.get(`${POSITION_CAMPAIGN_BASE_PATH}`).then(({ data }) => camelize(data.result))
}

const deletePositionCampaign = (recordDelete) => {
  return axiosInstance.delete(`${POSITION_CAMPAIGN_BASE_PATH}/${recordDelete}`)
}

const createPositionCampaign = (data) => {
  return axiosInstance.post(`${POSITION_CAMPAIGN_BASE_PATH}`, data).then(({ data }) => camelize(data))
}

const updatePositionCampaign = (id, data) => {
  return axiosInstance.put(`${POSITION_CAMPAIGN_BASE_PATH}/${id}`, data).then(({ data }) => camelize(data))
}

export { getAllPositions, deletePositionCampaign, createPositionCampaign, updatePositionCampaign }
