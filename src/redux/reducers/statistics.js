import { Statistics } from 'constants/actionTypes'

const initialState = {
  testTakerStatistics: {},
  discStatistics: {},
  brainStatistics: {},
  iqStatistics: {},
  eqStatistics: {},
  loadingGet: false,
  isInitialized: false,
}

const statistics = (state = initialState, action) => {
  switch (action.type) {
    case Statistics.REQUEST_GET_LIST_STATISTICS:
      return { ...state, loadingGet: true }
    case Statistics.GET_LIST_STATISTICS:
      return {
        ...state,
        isInitialized: true,
        testTakerStatistics: action.payload.statisticsList.test_taker_statistics,
        brainStatistics: action.payload.statisticsList.brain_statistics,
        iqStatistics: action.payload.statisticsList.iq_statistics,
        eqStatistics: action.payload.statisticsList.eq_statistics,
        discStatistics: action.payload.statisticsList.disc_statistics,
        loadingGet: false,
      }
    case Statistics.FAIL_REQUEST_STATISTICS:
      return { ...state, loadingGet: false }
    default:
      return state
  }
}

export default statistics
