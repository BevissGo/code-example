import { IQTest } from '../../constants/actionTypes'

export const updateListAnswer = (idQuestion, answer) => ({
  type: IQTest.UPDATE_LIST_ANSWER,
  payload: { [idQuestion]: answer },
})

export const failRequestPostAnswer = () => ({
  type: IQTest.FAIL_REQUEST_POST_ANSWER,
})

export const requestPostAnswer = () => ({
  type: IQTest.REQUEST_POST_ANSWER
})

export const postAnswer = () => ({
  type: IQTest.POST_ANSWER
})

export const clearListAnswer = () => ({
  type: IQTest.CLEAR_LIST_ANSWER
})
