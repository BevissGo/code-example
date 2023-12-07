import camelize from 'camelize-ts'

import axiosInstance from 'api'

const BASE_PATH = '/v2/business/custom-test-scores'

export const fetchCustomTestScoreList = async () => {
  return await axiosInstance.get(`${BASE_PATH}`).then(({ data }) => camelize(data.result))
}
