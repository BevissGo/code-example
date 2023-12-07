import { GroupQuestion } from 'constants/actionTypes'

export const requestGetListGroupQuestion = () => ({
  type: GroupQuestion.REQUEST_GET_LIST_GROUP_QUESTION,
})

export const getListGroupQuestion = (listGroupQuestion) => ({
  type: GroupQuestion.GET_LIST_GROUP_QUESTION,
  payload: { listGroupQuestion },
})

export const requestUpdateListGroupQuestion = () => ({
  type: GroupQuestion.REQUEST_UPDATE_LIST_GROUP_QUESTION,
})

export const updateListGroupQuestion = (keyIdGroupQuestion, dataAnswer) => ({
  type: GroupQuestion.UPDATE_LIST_GROUP_QUESTION,
  payload: { keyIdGroupQuestion, dataAnswer },
})

export const failRequestGroupQuestion = () => ({
  type: GroupQuestion.FAIL_REQUEST_GROUP_QUESTION,
})

export const clearListAnswerReport = () => ({
  type: GroupQuestion.CLEAR_LIST_ANSWER_REPORT,
})
