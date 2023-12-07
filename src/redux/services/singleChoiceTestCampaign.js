import api from 'api'
import { getPresignedUrl } from 'api/business/additionalQuestion.api'
import { isSuccessResponse } from 'helpers'
import { handleOpenModalFailure } from 'redux/services/modalError'
import { getValueFromStorage } from 'utils'
import {
  clearListSingleChoiceAnswer,
  failRequestPostSingleChoiceAnswer,
  postSingleChoiceAnswer,
  requestPostSingleChoiceAnswer,
} from '../actions/SingleChoiceTest'

export const submitSingleChoiceTest =
  (finishTest, listSingleChoiceAnswer, campaignId, positionId, timeByPage, finishedTime) => async (dispatch) => {
    try {
      dispatch(requestPostSingleChoiceAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`
      const body = { listSingleChoiceAnswer, timeByPage, finishedTime }

      const res = await api.post(`/v2/reports-campaign/single-choice/${campaignId}/${positionId}`, body, {
        headers: { Authorization: authHeader },
      })

      if (isSuccessResponse(res)) {
        dispatch(postSingleChoiceAnswer())
        dispatch(clearListSingleChoiceAnswer())
        finishTest()
      } else {
        dispatch(failRequestPostSingleChoiceAnswer())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened... Please try submit again',
        }),
      )
      dispatch(failRequestPostSingleChoiceAnswer())
    }
  }

export const submitSingleChoiceTestWithPosition =
  (
    finishTest,
    listSingleChoiceAnswer,
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
      dispatch(requestPostSingleChoiceAnswer())

      const accessToken = getValueFromStorage('access-token')
      const authHeader = `Bearer ${accessToken}`

      console.log('answerExtraQuestion ', answerExtraQuestion)

      const newAnswerExtraQuestion = await Promise.all(
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

      const formData = new FormData()

      const data = {
        campaign_id: campaignId,
        position_id: position._id ?? position.id,
        testId: 'single_choice_score',
        listSingleChoiceAnswer,
        answerExtraQuestion: newAnswerExtraQuestion,
        timeByPage,
        finishedTime,
      }

      formData.append('data', JSON.stringify(data))
      formData.append('cv', cvFile)
      formData.append('coverLetter', coverLetterFile)

      const res = await api.post('/v2/user-position-campaign/single-choice', formData, {
        headers: { Authorization: authHeader, 'Content-Type': 'multipart/form-data' },
      })

      if (isSuccessResponse(res)) {
        dispatch(postSingleChoiceAnswer())
        dispatch(clearListSingleChoiceAnswer())
        finishTest()
      } else {
        dispatch(failRequestPostSingleChoiceAnswer())
      }
    } catch (error) {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened... Please try submit again',
        }),
      )
      dispatch(failRequestPostSingleChoiceAnswer())
    }
  }
