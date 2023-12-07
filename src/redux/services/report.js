import api from 'api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse } from 'helpers'
import { getReport, postSurvey, failRequestReport, requestPostSurvey, requestGetReport } from '../actions/report'
import { logout } from '../services/auth'
import { handleOpenModalFailure } from '../services/modalError'
import { clearListAnswerReport } from '../actions/groupQuestion'

export const submitSurvey =
  (finishSurvey, listAnswer, finishedTime) =>
  async (
    dispatch,
    // getState
  ) => {
    try {
      dispatch(requestPostSurvey())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const body = {
        resultAnswer: {
          most: listAnswer.map((answer) => answer.most.keyIdQuestion),
          least: listAnswer.map((answer) => answer.least.keyIdQuestion),
        },
        finishedTime,
        listAnswer,
      }

      const res = await api.post('/v2/reports', body, {
        headers: { Authorization: authHeader },
      })

      if (isSuccessResponse(res)) {
        dispatch(postSurvey())
        dispatch(clearListAnswerReport())
        finishSurvey()
      } else {
        dispatch(failRequestReport())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened... Please try submit again',
        }),
      )
      dispatch(failRequestReport())
    }
  }

export const submitSurveyWithPosition =
  (finishSurvey, listAnswer, position, answerExtraQuestion, finishedTime) => async (dispatch) => {
    try {
      dispatch(requestPostSurvey())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const body = {
        position_id: position.id,
        answerExtraQuestion: answerExtraQuestion,
        resultAnswer: {
          most: listAnswer.map((answer) => answer.most.keyIdQuestion),
          least: listAnswer.map((answer) => answer.least.keyIdQuestion),
        },
        testId: 'report_id',
        listAnswer,
        finishedTime,
      }

      const res = await api.post('/v2/user-position/report', body, {
        headers: { Authorization: authHeader },
      })

      if (isSuccessResponse(res)) {
        dispatch(postSurvey())
        dispatch(clearListAnswerReport())
        finishSurvey()
      } else {
        dispatch(failRequestReport())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened..',
        }),
      )
      dispatch(failRequestReport())
    }
  }

export const fetchInfoResult = (redirectToSurvey, pathname) => async (dispatch) => {
  try {
    dispatch(requestGetReport())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get('/v2/reports', {
      headers: { Authorization: authHeader },
    })

    const payloadFunction = {
      doSurvey: () => redirectToSurvey(),
      logOut: () => dispatch(logout()),
    }

    if (isSuccessResponse(res, payloadFunction, pathname)) {
      const { result } = res.data

      const {
        listChart,
        listPersonality,
        profilePattern,
        reportIqNewest,
        reportBrainTestNewest,
        reportEQNewest,
        reportSingleChoiceNewest,
        reportCustomTestNewest,
      } = result

      dispatch(
        getReport({
          listChart,
          listPersonality,
          profilePattern,
          reportIqNewest,
          reportBrainTestNewest,
          reportEQNewest,
          reportSingleChoiceNewest,
          reportCustomTestNewest,
        }),
      )
    } else {
      dispatch(failRequestReport())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestReport())
  }
}

export const getReportByUserId = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/v2/reports/${userId}`)

    if (isSuccessResponse(res)) {
      const { result } = res.data
      return result
    } else {
      return {}
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )

    return {}
  }
}
