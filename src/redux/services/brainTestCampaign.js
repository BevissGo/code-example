import api from 'api'
import { getPresignedUrl } from 'api/business/additionalQuestion.api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse } from 'helpers'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { failRequestReport, getReport, requestGetReport } from 'redux/actions/report'
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

export const submitBrainTest =
  (finishTest, listAnswer, campaignId, positionId, timeByPage, finishedTime, listLRBrainQuestion) =>
  async (dispatch) => {
    try {
      dispatch(requestPostAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      const body = calcBrainTestScore(listAnswer, timeByPage, finishedTime, listLRBrainQuestion)

      const res = await api.post(`/v2/reports-campaign/brain/${campaignId}/${positionId}`, body, {
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

const calcBrainTestScore = (listAnswer, timeByPage, finishedTime, listLRBrainQuestion) => {
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
      timeByPage,
      finishedTime,
      answerList,
    }
  } else {
    return {
      score: answerR,
      sideOfBrain: 'R',
      timeByPage,
      finishedTime,
      answerList,
    }
  }
}

export const submitBrainTestWithPosition =
  (
    finishTest,
    listAnswer,
    position,
    campaignId,
    answerExtraQuestion,
    cvFile,
    coverLetterFile,
    timeByPage,
    finishedTime = 0,
    listLRBrainQuestion,
  ) =>
  async (dispatch) => {
    try {
      dispatch(requestPostAnswer())

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
        category_survey: 'brain_score',
      }))

      const updateAnswerExtraQuestiom = {
        file_key: newAnswerExtraQuestion.file_key,
        file_path: newAnswerExtraQuestion.file_path,
        answer_survey: answerSurvey,
      }

      const formData = new FormData()

      const data = {
        ...calcBrainTestScore(listAnswer, timeByPage, finishedTime, listLRBrainQuestion),
        campaign_id: campaignId,
        position_id: position.id,
        testId: 'brain_score',
        answerExtraQuestion: updateAnswerExtraQuestiom,
        timeByPage,
        finishedTime,
      }

      formData.append('data', JSON.stringify(data))
      formData.append('cv', cvFile)
      formData.append('coverLetter', coverLetterFile)

      const res = await api.post('/v2/user-position-campaign/brain', formData, {
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

export const fetchInfoResult = (redirectToSurvey, pathname, campaignId, positionId) => async (dispatch) => {
  try {
    dispatch(requestGetReport())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get(`/v2/reports-campaign/${campaignId}/${positionId}`, {
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
