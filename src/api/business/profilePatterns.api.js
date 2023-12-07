import camelize from 'camelize-ts'

import axiosInstance from 'api'

const BUSINESS_PROFILE_PATTERN_BASE_PATH = '/v2/business/profile_patterns'

const fetchProfilePatterns = () => {
  return axiosInstance.get(BUSINESS_PROFILE_PATTERN_BASE_PATH).then(({ data }) => camelize(data.result))
}

export { fetchProfilePatterns }
