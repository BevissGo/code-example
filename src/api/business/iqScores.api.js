import camelize from 'camelize-ts'
import { stringifyUrl } from 'query-string'

import axiosInstance from 'api'

const BUSINESS_IQ_SCORES_BASE_PATH = '/v2/business/iq-scores'

const fetchIQTestStatisticResult = async (ctx, params = {}) => {
  return axiosInstance
    .get(
      stringifyUrl({
        url: `${BUSINESS_IQ_SCORES_BASE_PATH}/overal-result-chart`,
        query: params,
      }),
    )
    .then(({ data }) => camelize(data.result))
}

export { fetchIQTestStatisticResult }
