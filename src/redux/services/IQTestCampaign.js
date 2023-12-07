import api from 'api'
import { getPresignedUrl } from 'api/business/additionalQuestion.api'
import { isSuccessResponse } from 'helpers'
import { getValueFromStorage } from 'utils'
import { postAnswer, clearListAnswer, requestPostAnswer, failRequestPostAnswer } from '../actions/IQTest'
import { iqTestPage } from '../../constants/images'
import { handleOpenModalFailure } from './modalError'

export const submitIQTest =
  (finishTest, listAnswer, campaignId, positionId, timeByPage, finishedTime) => async (dispatch) => {
    try {
      dispatch(requestPostAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const body = calcScoreIQ(listAnswer, timeByPage, finishedTime)

      const res = await api.post(`/v2/reports-campaign/iq/${campaignId}/${positionId}`, body, {
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

export const submitIQTestWithPositionCampaign =
  (
    finishTest,
    listAnswer,
    position,
    campaignId,
    answerExtraQuestion,
    cvFile,
    coverLetterFile,
    timeByPage,
    finishedTime,
  ) =>
  async (dispatch) => {
    try {
      dispatch(requestPostAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      let newAnswerExtraQuestion = []

      if (answerExtraQuestion) {
        newAnswerExtraQuestion = await Promise.all(
          answerExtraQuestion?.map(async (item, index) => {
            if (item.type_answer === 'file' || (item.type_answer === 'image' && item.answer.file)) {
              const keyFile = position.answer_additional_question[index]?.file_key ?? null
              const { key, url } = keyFile
                ? await getPresignedUrl(item.answer.file, { keyFile, update: true })
                : await getPresignedUrl(item.answer.file)
              return {
                ...item,
                answer: item.answer.file.name,
                file_key: key,
                file_path: url,
                file: undefined,
                fileList: undefined,
              }
            } else {
              return item
            }
          }),
        )
      }

      const formData = new FormData()

      const resultIqScore = calcScoreIQ(listAnswer, finishedTime)

      const answerSurvey = newAnswerExtraQuestion.map((question) => ({
        question: question.question,
        required_answer: question.required_answer,
        type_answer: question.type_answer,
        answer: question.answer,
        category_survey: 'iq_score',
      }))

      const updateAnswerExtraQuestiom = {
        file_key: newAnswerExtraQuestion.file_key,
        file_path: newAnswerExtraQuestion.file_path,
        answer_survey: answerSurvey,
      }

      const data = {
        campaign_id: campaignId,
        position_id: position.id,
        testId: 'iq_score',
        answerExtraQuestion: updateAnswerExtraQuestiom,
        iQResult: resultIqScore.iQResult,
        correct: resultIqScore.correct,
        rank: resultIqScore.rank,
        answerList: resultIqScore.answerList,
        timeByPage,
        finishedTime,
      }

      formData.append('data', JSON.stringify(data))
      formData.append('cv', cvFile)
      formData.append('coverLetter', coverLetterFile)

      const res = await api.post('/v2/user-position-campaign/iq', formData, {
        headers: { Authorization: authHeader, 'Content-Type': 'multipart/form-data' },
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

export const calcScoreIQ = (listAnswer, timeByPage, finishedTime) => {
  const arrAnswer = Object.keys(listAnswer).map((k) => listAnswer[k])
  const arrResult = Object.keys(iqTestPage.listResult).map((k) => iqTestPage.listResult[k])
  const listRanks = iqTestPage.listRanks

  const answerList = arrAnswer.map((answer, index) => ({ question: `Câu ${index + 1}`, answer }))

  let iQResult = 0
  let correct = 0
  let rank = ''

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

  return { iQResult, correct, rank, timeByPage, finishedTime, answerList }
}
