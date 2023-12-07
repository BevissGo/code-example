import { EQQuestion } from '../../constants/actionTypes'

export const requestGetListEQQuestion = () => ({
  type: EQQuestion.REQUEST_GET_LIST_EQ_QUESTION,
})

export const getListEQQuestion = (listEQQuestion) => ({
  type: EQQuestion.GET_LIST_EQ_QUESTION,
  payload: { listEQQuestion },
})

export const failRequestEQQuestion = () => ({
  type: EQQuestion.FAIL_REQUEST_EQ_QUESTION,
})


export const updateListEQAnswer = (idQuestion, answer) => ({
  type: EQQuestion.UPDATE_LIST_EQ_ANSWER,
  payload: { [idQuestion]: answer },
})

export const failRequestPostEQAnswer = () => ({
  type: EQQuestion.FAIL_REQUEST_POST_EQ_ANSWER,
})

export const requestPostEQAnswer = () => ({
  type: EQQuestion.REQUEST_POST_EQ_ANSWER
})

export const postEQAnswer = () => ({
  type: EQQuestion.POST_EQ_ANSWER
})

export const clearListEQAnswer = () => ({
  type: EQQuestion.CLEAR_LIST_EQ_ANSWER
})
