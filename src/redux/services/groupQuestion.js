import api from 'api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse, renewListGroupQuestion, convertListGroupQuestionArrayToObject } from 'helpers'
import {
  getListGroupQuestion,
  updateListGroupQuestion,
  failRequestGroupQuestion,
  requestGetListGroupQuestion,
  requestUpdateListGroupQuestion,
} from '../actions/groupQuestion'
import { logout } from '../services/auth'
import { handleOpenModalFailure } from '../services/modalError'

const fetchListGroupQuestion = () => async (dispatch) => {
  try {
    dispatch(requestGetListGroupQuestion())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get('/v2/group-questions', {
      headers: { Authorization: authHeader },
    })

    const payloadFunction = { logOut: () => dispatch(logout()) }

    if (isSuccessResponse(res, payloadFunction)) {
      const { result } = res.data
      const { listGroupQuestion } = result

      const listGroupQuestionObject = convertListGroupQuestionArrayToObject(listGroupQuestion)

      dispatch(getListGroupQuestion(renewListGroupQuestion(listGroupQuestionObject)))
    } else {
      dispatch(failRequestGroupQuestion())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestGroupQuestion())
  }
}

const shouldFetchListGroupQuestion = (state) => {
  const { isInitialized } = state
  return !isInitialized
}

export const fetchListGroupQuestionIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchListGroupQuestion(getState().groupQuestion)) {
    return dispatch(fetchListGroupQuestion())
  }
  return true
}

export const editListGroupQuestion = (indexGroupQuestion, keyIdQuestion) => async (dispatch) => {
  try {
    dispatch(requestUpdateListGroupQuestion())

    dispatch(updateListGroupQuestion(indexGroupQuestion, keyIdQuestion))
  } catch (error) {
    dispatch(failRequestGroupQuestion())
  }
}
