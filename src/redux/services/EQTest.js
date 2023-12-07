import api from 'api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse } from 'helpers'
import { handleOpenModalFailure } from 'redux/services/modalError'
import {
  postEQAnswer,
  clearListEQAnswer,
  getListEQQuestion,
  requestPostEQAnswer,
  failRequestEQQuestion,
  failRequestPostEQAnswer,
  requestGetListEQQuestion,
} from '../actions/EQTest'
import { logout } from './auth'

const fetchListEQQuestion = () => async (dispatch) => {
  try {
    dispatch(requestGetListEQQuestion())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get('/v2/eq-questions', {
      headers: { Authorization: authHeader },
    })

    const payloadFunction = { logOut: () => dispatch(logout()) }

    if (isSuccessResponse(res, payloadFunction)) {
      const { result } = res.data
      const { listEQQuestions } = result

      dispatch(getListEQQuestion(listEQQuestions))
    } else {
      dispatch(failRequestEQQuestion())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestEQQuestion())

    console.log(error)
  }
}

const shouldFetchEQQuestion = (state) => {
  const { isInitialized } = state
  return !isInitialized
}

export const fetchListEQQuestionIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchEQQuestion(getState().EQTest)) {
    return dispatch(fetchListEQQuestion())
  }
  return true
}

export const submitEQTest = (finishTest, listEQAnswer, finishedTime) => async (dispatch) => {
  try {
    dispatch(requestPostEQAnswer())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`
    const body = { listEQAnswer, finishedTime }

    const res = await api.post('/v2/reports/eq-test', body, {
      headers: { Authorization: authHeader },
    })

    if (isSuccessResponse(res)) {
      dispatch(postEQAnswer())
      dispatch(clearListEQAnswer())
      finishTest()
    } else {
      dispatch(failRequestPostEQAnswer())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened... Please try submit again',
      }),
    )
    dispatch(failRequestPostEQAnswer())
  }
}

export const submitEQTestWithPosition =
  (finishTest, listEQAnswer, position, answerExtraQuestion, finishedTime) => async (dispatch) => {
    try {
      dispatch(requestPostEQAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const body = {
        listEQAnswer,
        answerExtraQuestion,
        testId: 'eq_score_id',
        position_id: position.id,
        finishedTime,
      }

      const res = await api.post('/v2/user-position/eq', body, {
        headers: { Authorization: authHeader },
      })

      if (isSuccessResponse(res)) {
        dispatch(postEQAnswer())
        dispatch(clearListEQAnswer())
        finishTest()
      } else {
        dispatch(failRequestPostEQAnswer())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened... Please try submit again',
        }),
      )
      dispatch(failRequestPostEQAnswer())
    }
  }
