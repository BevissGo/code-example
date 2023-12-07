import instance from 'api'
import { setHeader } from 'utils/setHeader'
import { failRequestStatistics, getListStatistics, requestGetListStatistics } from 'redux/actions/statistics'

import { handleOpenModalFailure } from './modalError'

export const fetchStatistics = () => async (dispatch) => {
  try {
    dispatch(requestGetListStatistics())

    const header = await setHeader()
    const res = await instance.get('/v2/statistics/latest', header)
    const testTakerStatistics = await instance.get('/v2/statistics/test-taker-statistic', header)

    if (res.status === 200) {
      const statisticsList = { ...res.data.result, ...testTakerStatistics.data.result }

      dispatch(getListStatistics(statisticsList))
    } else {
      dispatch(failRequestStatistics())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestStatistics())
  }
}
