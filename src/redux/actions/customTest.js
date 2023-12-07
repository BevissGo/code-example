import { CustomTestQuestion } from '../../constants/actionTypes'

export const requestGetListCustomTestQuestion = () => ({
  type: CustomTestQuestion.REQUEST_GET_LIST_CUSTOM_TEST_QUESTION,
})

export const getListCustomTestQuestion = (listCustomTestQuestion) => ({
  type: CustomTestQuestion.GET_LIST_CUSTOM_TEST_QUESTION,
  payload: { listCustomTestQuestion },
})

export const failRequestCustomTestQuestion = () => ({
  type: CustomTestQuestion.FAIL_REQUEST_CUSTOM_TEST_QUESTION,
})

export const updateListCustomTestAnswer = (idQuestion, answerCorrect, answer) => ({
  type: CustomTestQuestion.UPDATE_LIST_CUSTOM_TEST_ANSWER,
  payload: { [idQuestion]: answerCorrect, ['answer' + idQuestion]: answer },
})

export const failRequestPostCustomTestAnswer = () => ({
  type: CustomTestQuestion.FAIL_REQUEST_POST_CUSTOM_TEST_ANSWER,
})

export const requestPostCustomTestAnswer = () => ({
  type: CustomTestQuestion.REQUEST_POST_CUSTOM_TEST_ANSWER,
})

export const postCustomTestAnswer = () => ({
  type: CustomTestQuestion.POST_CUSTOM_TEST_ANSWER,
})

export const clearListCustomTestAnswer = () => ({
  type: CustomTestQuestion.CLEAR_LIST_CUSTOM_TEST_ANSWER,
})
