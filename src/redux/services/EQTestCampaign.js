import api from 'api'
import { getPresignedUrl } from 'api/business/additionalQuestion.api'
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

export const submitEQTest =
  (finishTest, listEQAnswer, campaignId, positionId, timeByPage, finishedTime) => async (dispatch) => {
    try {
      dispatch(requestPostEQAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`
      const body = { listEQAnswer, timeByPage, finishedTime }

      const res = await api.post(`/v2/reports-campaign/eq/${campaignId}/${positionId}`, body, {
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
  (
    finishTest,
    listEQAnswer,
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
      dispatch(requestPostEQAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      let newAnswerExtraQuestion = []

      if (answerExtraQuestion) {
        newAnswerExtraQuestion = await Promise.all(
          answerExtraQuestion.map(async (item, index) => {
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

      const answerSurvey = newAnswerExtraQuestion.map((question) => ({
        question: question.question,
        required_answer: question.required_answer,
        type_answer: question.type_answer,
        answer: question.answer,
        category_survey: 'eq_score',
      }))

      const updateAnswerExtraQuestiom = {
        file_key: newAnswerExtraQuestion.file_key,
        file_path: newAnswerExtraQuestion.file_path,
        answer_survey: answerSurvey,
      }

      const formData = new FormData()

      const data = {
        campaign_id: campaignId,
        position_id: position.id,
        testId: 'eq_score',
        listEQAnswer,
        answerExtraQuestion: updateAnswerExtraQuestiom,
        timeByPage,
        finishedTime,
      }

      formData.append('data', JSON.stringify(data))
      formData.append('cv', cvFile)
      formData.append('coverLetter', coverLetterFile)

      const res = await api.post('/v2/user-position-campaign/eq', formData, {
        headers: { Authorization: authHeader, 'Content-Type': 'multipart/form-data' },
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
