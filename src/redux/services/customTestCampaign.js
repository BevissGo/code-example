import api from 'api'
import { getPresignedUrl } from 'api/business/additionalQuestion.api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse } from 'helpers'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { failRequestReport, getReport, requestGetReport } from 'redux/actions/report'

import {
  postCustomTestAnswer,
  clearListCustomTestAnswer,
  getListCustomTestQuestion,
  requestPostCustomTestAnswer,
  failRequestCustomTestQuestion,
  failRequestPostCustomTestAnswer,
  requestGetListCustomTestQuestion,
} from '../actions/customTest'
import { logout } from './auth'

const fetchListCustomTestQuestion = () => async (dispatch) => {
  try {
    dispatch(requestGetListCustomTestQuestion())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get('/v2/custom-test-questions', {
      headers: { Authorization: authHeader },
    })

    const payloadFunction = { logOut: () => dispatch(logout()) }

    if (isSuccessResponse(res, payloadFunction)) {
      const { result } = res.data
      const { listCustomTestQuestions } = result

      dispatch(getListCustomTestQuestion(listCustomTestQuestions))
    } else {
      dispatch(failRequestCustomTestQuestion())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestCustomTestQuestion())
  }
}

const shouldFetchCustomTestQuestion = (state) => {
  const { isInitialized } = state
  return !isInitialized
}

export const fetchListCustomTestQuestionIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchCustomTestQuestion(getState().customTest)) {
    return dispatch(fetchListCustomTestQuestion())
  }
  return true
}

export const submitCustomTest =
  (
    finishTest,
    listCustomTestAnswer,
    campaignId,
    positionId,
    testId,
    timeByPage,
    finishedTime,
    listCustomTestQuestion,
    currentListAnswerByUser,
  ) =>
  async (dispatch) => {
    try {
      dispatch(requestPostCustomTestAnswer())

      const listAnswer = listCustomTestQuestion.map((question, index) => ({
        question: question.question,
        answer: currentListAnswerByUser[index],
      }))

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`
      const body = { listCustomTestAnswer, timeByPage, finishedTime, testId, listAnswer }

      const res = await api.post(`/v2/reports-campaign/custom-test/${campaignId}/${positionId}`, body, {
        headers: { Authorization: authHeader },
      })

      if (isSuccessResponse(res)) {
        dispatch(postCustomTestAnswer())
        dispatch(clearListCustomTestAnswer())
        finishTest()
      } else {
        dispatch(failRequestPostCustomTestAnswer())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened... Please try submit again',
        }),
      )
      dispatch(failRequestPostCustomTestAnswer())
    }
  }

export const submitCustomTestWithPosition =
  (
    finishTest,
    listCustomTestAnswer,
    position,
    campaignId,
    testId,
    answerExtraQuestion,
    cvFile,
    coverLetterFile,
    timeByPage,
    finishedTime,
    listCustomTestQuestion,
    currentListAnswerByUser,
  ) =>
  async (dispatch) => {
    try {
      dispatch(requestPostCustomTestAnswer())

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

      const listAnswer = listCustomTestQuestion.map((question, index) => ({
        question: question.question,
        answer: currentListAnswerByUser[index],
      }))

      const answerSurvey = newAnswerExtraQuestion.map((question) => ({
        question: question.question,
        required_answer: question.required_answer,
        type_answer: question.type_answer,
        answer: question.answer,
        category_survey: 'custom_test_score',
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
        current_test_id: testId,
        testId: 'custom_test_score',
        listCustomTestAnswer,
        answerExtraQuestion: updateAnswerExtraQuestiom,
        timeByPage,
        finishedTime,
        listAnswer,
      }

      formData.append('data', JSON.stringify(data))
      formData.append('cv', cvFile)
      formData.append('coverLetter', coverLetterFile)

      const res = await api.post('/v2/user-position-campaign/custom-test', formData, {
        headers: { Authorization: authHeader, 'Content-Type': 'multipart/form-data' },
      })

      if (isSuccessResponse(res)) {
        dispatch(postCustomTestAnswer())
        dispatch(clearListCustomTestAnswer())
        finishTest()
      } else {
        dispatch(failRequestPostCustomTestAnswer())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened... Please try submit again',
        }),
      )
      dispatch(failRequestPostCustomTestAnswer())
    }
  }

export const fetchInfoResult = (redirectToSurvey, pathname, campaignId, positionId, testId) => async (dispatch) => {
  try {
    dispatch(requestGetReport())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get(`/v2/reports-campaign/${campaignId}/${positionId}`, {
      params: { testId: testId },
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
        reportDiscNewest,
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
          reportDiscNewest,
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
