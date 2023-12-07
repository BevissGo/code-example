import { Report } from 'constants/actionTypes'

export const requestPostSurvey = () => ({
  type: Report.REQUEST_POST_REPORT,
})

export const postSurvey = () => ({
  type: Report.POST_REPORT,
})

export const requestGetReport = () => ({
  type: Report.REQUEST_GET_REPORT,
})

export const getReport = ({
  listChart,
  listPersonality,
  profilePattern,
  reportDiscNewest,
  reportIqNewest,
  reportBrainTestNewest,
  reportEQNewest,
  reportSingleChoiceNewest,
  reportCustomTestNewest,
}) => ({
  type: Report.GET_REPORT,
  payload: {
    listChart,
    listPersonality,
    profilePattern,
    reportDiscNewest,
    reportIqNewest,
    reportBrainTestNewest,
    reportEQNewest,
    reportSingleChoiceNewest,
    reportCustomTestNewest,
    testing: 'hello',
  },
})

export const failRequestReport = () => ({
  type: Report.FAIL_REQUEST_REPORT,
})
