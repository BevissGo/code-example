import api from 'api'
import { isSuccessResponse } from 'helpers'
import { getValueFromStorage } from 'utils'
import { postAnswer, clearListAnswer, requestPostAnswer, failRequestPostAnswer } from '../actions/IQTest'
import { handleOpenModalFailure } from '../services/modalError'
import { iqTestPage } from '../../constants/images'

export const submitIQTest =
  (finishTest, listAnswer, finishedTime) =>
  async (
    dispatch,
    // getState
  ) => {
    try {
      dispatch(requestPostAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const body = calcScoreIQ(listAnswer, finishedTime)

      const res = await api.post('/v2/reports/iq', body, {
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

export const submitIQTestWithPosition =
  (finishTest, listAnswer, position, answerExtraQuestion, finishedTime) => async (dispatch) => {
    try {
      dispatch(requestPostAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const resultIqScore = calcScoreIQ(listAnswer, finishedTime)
      const body = {
        position_id: position.id,
        answerExtraQuestion: answerExtraQuestion,
        iQResult: resultIqScore.iQResult,
        correct: resultIqScore.correct,
        rank: resultIqScore.rank,
        testId: 'iq_score_id',
        answerList: resultIqScore.answerList,
        finishedTime,
      }

      const res = await api.post('/v2/user-position/iq', body, {
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

export const calcScoreIQ = (listAnswer, finishedTime) => {
  const arrAnswer = Object.keys(listAnswer).map((k) => listAnswer[k])
  const arrResult = Object.keys(iqTestPage.listResult).map((k) => iqTestPage.listResult[k])
  const listRanks = iqTestPage.listRanks
  let iQResult = 0
  let correct = 0
  let rank = ''

  const answerList = arrAnswer.map((answer, index) => ({ question: `Câu ${index + 1}`, answer }))

  arrAnswer.forEach((value, index) => {
    if (value === arrResult[index]) {
      correct += 1
    }
  })

  switch (correct) {
    case 6:
      iQResult = 77
      rank = listRanks.quiteLow
      break
    case 7:
      iQResult = 79
      rank = listRanks.quiteLow
      break
    case 8:
      iQResult = 84
      rank = listRanks.middleLow
      break
    case 9:
      iQResult = 88
      rank = listRanks.middleLow
      break
    case 10:
      iQResult = 92
      rank = listRanks.middleLow
      break
    case 11:
      iQResult = 94
      rank = listRanks.middle
      break
    case 12:
      iQResult = 98
      rank = listRanks.middle
      break
    case 13:
      iQResult = 101
      rank = listRanks.high
      break
    case 14:
      iQResult = 104
      rank = listRanks.high
      break
    case 15:
      iQResult = 108
      rank = listRanks.veryHigh
      break
    case 16:
      iQResult = 111
      rank = listRanks.veryHigh
      break
    case 17:
      iQResult = 114
      rank = listRanks.great
      break
    case 18:
      iQResult = 119
      rank = listRanks.great
      break
    case 19:
      iQResult = 123
      rank = listRanks.great
      break
    case 20:
      iQResult = 125
      rank = listRanks.veryGreat
      break
    case 21:
      iQResult = 132
      rank = listRanks.veryGreat
      break
    case 22:
      iQResult = 139
      rank = listRanks.veryGreat
      break
    case 23:
      iQResult = 146
      rank = listRanks.genius
      break
    case 24:
      iQResult = 153
      rank = listRanks.genius
      break
    case 25:
      iQResult = 160
      rank = listRanks.genius
      break
    default:
      iQResult = 73
      rank = listRanks.low
      break
  }

  return { iQResult, correct, rank, finishedTime, answerList }
}
