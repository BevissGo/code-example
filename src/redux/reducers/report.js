import { Report } from 'constants/actionTypes'

const initialState = {
  listChart: {
    most: {
      D: 0,
      I: 0,
      S: 0,
      C: 0,
    },
    least: {
      D: 0,
      I: 0,
      S: 0,
      C: 0,
    },
    difference: {
      D: 0,
      I: 0,
      S: 0,
      C: 0,
    },
  },
  listPersonality: Array(6).fill({}),
  profilePattern: {},
  loadingPost: false,
  loadingGet: false,
}

const report = (state = initialState, action) => {
  switch (action.type) {
    case Report.REQUEST_POST_REPORT:
      return { ...state, loadingPost: true }
    case Report.POST_REPORT:
      return { ...state, loadingPost: false }
    case Report.REQUEST_GET_REPORT:
      return { ...state, loadingGet: true }
    case Report.GET_REPORT:
      if (!action.payload.profilePattern) {
        return {
          ...state,
          loadingGet: false,
          reportDiscNewest: action.payload.reportDiscNewest || {},
          reportIqNewest: action.payload.reportIqNewest || {},
          reportBrainTestNewest: action.payload.reportBrainTestNewest,
          reportEQNewest: action.payload.reportEQNewest,
          reportSingleChoiceNewest: action.payload.reportSingleChoiceNewest,
          reportCustomTestNewest: action.payload.reportCustomTestNewest,
        }
      }

      return {
        ...state,
        loadingGet: false,
        listChart: {
          difference: { ...state.listChart.difference },
          ...action.payload.listChart,
        },
        listPersonality: [...action.payload.listPersonality],
        profilePattern: action.payload.profilePattern || {},
        reportIqNewest: action.payload.reportIqNewest || {},
        reportDiscNewest: action.payload.reportDiscNewest || {},
        reportBrainTestNewest: action.payload.reportBrainTestNewest,
        reportEQNewest: action.payload.reportEQNewest,
        reportSingleChoiceNewest: action.payload.reportSingleChoiceNewest,
        reportCustomTestNewest: action.payload.reportCustomTestNewest,
      }
    case Report.FAIL_REQUEST_REPORT:
      return { ...state, loadingPost: false, loadingGet: false }
    default:
      return state
  }
}

export default report
