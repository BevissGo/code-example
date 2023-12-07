import api from 'api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse } from 'helpers'
import { handleOpenModalFailure } from 'redux/services/modalError'
import {
  postAnswer,
  clearListAnswer,
  requestPostAnswer,
  failRequestPostAnswer,
  getListLRBrainQuestion,
  failRequestLRBrainQuestion,
  requestGetListLRBrainQuestion,
} from '../actions/brainTest'
import { logout } from './auth'

const fetchListLRBrainQuestion = () => async (dispatch) => {
  try {
    dispatch(requestGetListLRBrainQuestion())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get('/v2/lr-brain-questions', {
      headers: { Authorization: authHeader },
    })

    const payloadFunction = { logOut: () => dispatch(logout()) }

    if (isSuccessResponse(res, payloadFunction)) {
      const { result } = res.data
      const { listLRBrainQuestion } = result

      dispatch(getListLRBrainQuestion(listLRBrainQuestion))
    } else {
      dispatch(failRequestLRBrainQuestion())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestLRBrainQuestion())
  }
}

const shouldFetchListLRBrainQuestion = (state) => {
  const { isInitialized } = state
  return !isInitialized
}

export const fetchListLRBrainQuestionIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchListLRBrainQuestion(getState().brainTest)) {
    return dispatch(fetchListLRBrainQuestion())
  }
  return true
}

export const submitBrainTest = (finishTest, listAnswer, finishedTime, listLRBrainQuestion) => async (dispatch) => {
  try {
    dispatch(requestPostAnswer())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const body = calcBrainTestScore(listAnswer, finishedTime, listLRBrainQuestion)

    const res = await api.post('/v2/reports/brain-test', body, {
      headers: { Authorization: authHeader },
    })

    if (isSuccessResponse(res)) {
      dispatch(postAnswer())
      dispatch(clearListAnswer())
      finishTest()
    } else {
      dispatch(failRequestPostAnswer())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened... Please try submit again',
      }),
    )
    dispatch(failRequestPostAnswer())
  }
}

const calcBrainTestScore = (listAnswer, finishedTime, listLRBrainQuestion) => {
  const answerL = listAnswer.filter((answer) => answer === 'L').length
  const answerR = listAnswer.length - answerL

  const answerList = []

  listAnswer.forEach((answer, index) => {
    answerList.push({ question: `Câu ${index + 1}: ${listLRBrainQuestion[index]['question']}`, answer })
  })

  if (answerL >= answerR) {
    return {
      score: answerL,
      sideOfBrain: 'L',
      finishedTime,
      answerList,
    }
  } else {
    return {
      score: answerR,
      sideOfBrain: 'R',
      finishedTime,
      answerList,
    }
  }
}

export const submitBrainTestWithPosition =
  (finishTest, listAnswer, position, answerExtraQuestion, testDuration, listLRBrainQuestion) => async (dispatch) => {
    try {
      dispatch(requestPostAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const body = {
        ...calcBrainTestScore(listAnswer, testDuration, listLRBrainQuestion),
        position_id: position.id,
        answerExtraQuestion,
        testId: 'brain_score_id',
      }

      const res = await api.post('/v2/user-position/brain', body, {
        headers: { Authorization: authHeader },
      })

      if (isSuccessResponse(res)) {
        dispatch(postAnswer())
        dispatch(clearListAnswer())
        finishTest()
      } else {
        dispatch(failRequestPostAnswer())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened..',
        }),
      )
      dispatch(failRequestPostAnswer())
    }
  }
