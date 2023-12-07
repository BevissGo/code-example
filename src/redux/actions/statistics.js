import { Statistics } from 'constants/actionTypes'

export const requestGetListStatistics = () => ({
  type: Statistics.REQUEST_GET_LIST_STATISTICS,
})

export const getListStatistics = (statisticsList) => ({
  type: Statistics.GET_LIST_STATISTICS,
  payload: { statisticsList },
})

export const failRequestStatistics = () => ({
  type: Statistics.FAIL_REQUEST_STATISTICS,
})
