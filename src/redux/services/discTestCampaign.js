import api from 'api'
import { getPresignedUrl } from 'api/business/additionalQuestion.api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse } from 'helpers'
import { getReport, postSurvey, failRequestReport, requestPostSurvey, requestGetReport } from '../actions/report'
import { clearListAnswerReport } from '../actions/groupQuestion'
import { logout } from './auth'
import { handleOpenModalFailure } from './modalError'

export const submitSurvey =
  (finishSurvey, listAnswer, campaignId, positionId, timeByPage, finishedTime) =>
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
        timeByPage,
        finishedTime,
        listAnswer,
      }

      const res = await api.post(`/v2/reports-campaign/disc/${campaignId}/${positionId}`, body, {
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
  (
    finishSurvey,
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
      dispatch(requestPostSurvey())

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
        category_survey: 'disc_score',
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
        answerExtraQuestion: updateAnswerExtraQuestiom,
        resultAnswer: {
          most: listAnswer.map((answer) => answer.most.keyIdQuestion),
          least: listAnswer.map((answer) => answer.least.keyIdQuestion),
        },
        testId: 'disc_score',
        timeByPage,
        finishedTime,
        listAnswer,
      }

      formData.append('data', JSON.stringify(data))
      formData.append('cv', cvFile)
      formData.append('coverLetter', coverLetterFile)

      const res = await api.post('/v2/user-position-campaign/disc', formData, {
        headers: { Authorization: authHeader, 'Content-Type': 'multipart/form-data' },
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

export const getReportCampaignByUserId = (campaignId, positionId, userId) => async (dispatch) => {
  try {
    const res = await api.get(`/v2/reports-campaign/${campaignId}/${positionId}/${userId}`)

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
