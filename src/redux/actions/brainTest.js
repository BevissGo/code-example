import { LRBrainQuestion } from 'constants/actionTypes'

export const requestGetListLRBrainQuestion = () => ({
  type: LRBrainQuestion.REQUEST_GET_LIST_LR_BRAIN_QUESTION,
})

export const getListLRBrainQuestion = (listLRBrainQuestion) => ({
  type: LRBrainQuestion.GET_LIST_LR_BRAIN_QUESTION,
  payload: { listLRBrainQuestion },
})

export const failRequestLRBrainQuestion = () => ({
  type: LRBrainQuestion.FAIL_REQUEST_LR_BRAIN_QUESTION,
})

export const updateListLRBrainAnswer = (questionId, answer) => ({
  type: LRBrainQuestion.UPDATE_LIST_LR_BRAIN_ANSWER,
  payload: { [questionId]: answer },
})

export const requestPostAnswer = () => ({
  type: LRBrainQuestion.REQUEST_POST_BRAIN_ANSWER,
})

export const postAnswer = () => ({
  type: LRBrainQuestion.POST_ANSWER,
})

export const clearListAnswer = () => ({
  type: LRBrainQuestion.CLEAR_LIST_BRAIN_ANSWER,
})

export const failRequestPostAnswer = () => ({
  type: LRBrainQuestion.FAIL_REQUEST_POST_BRAIN_ANSWER,
})
