import { SingleChoiceQuestion } from '../../constants/actionTypes'

export const getListSingleChoiceQuestion = (listSingleChoiceQuestion) => ({
  type: SingleChoiceQuestion.GET_LIST_SINGLE_CHOICE_QUESTION,
  payload: { listSingleChoiceQuestion },
})

export const failRequestSingleChoiceQuestion = () => ({
  type: SingleChoiceQuestion.FAIL_REQUEST_SINGLE_CHOICE_QUESTION,
})

export const updateListSingleChoiceAnswer = (idQuestion, answer) => ({
  type: SingleChoiceQuestion.UPDATE_LIST_SINGLE_CHOICE_ANSWER,
  payload: { [idQuestion]: answer },
})

export const failRequestPostSingleChoiceAnswer = () => ({
  type: SingleChoiceQuestion.FAIL_REQUEST_POST_SINGLE_CHOICE_ANSWER,
})

export const requestPostSingleChoiceAnswer = () => ({
  type: SingleChoiceQuestion.REQUEST_POST_SINGLE_CHOICE_ANSWER,
})

export const postSingleChoiceAnswer = () => ({
  type: SingleChoiceQuestion.POST_SINGLE_CHOICE_ANSWER,
})

export const clearListSingleChoiceAnswer = () => ({
  type: SingleChoiceQuestion.CLEAR_LIST_SINGLE_CHOICE_ANSWER,
})
