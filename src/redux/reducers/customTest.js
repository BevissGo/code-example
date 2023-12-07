import { CustomTestQuestion } from 'constants/actionTypes'

const initialState = {
  listCustomTestQuestion: {},
  isInitialized: false,
  loadingGet: false,
  loadingUpdate: false,
  listCustomTestAnswer: [],
  loadingPost: false,
}

const customTest = (state = initialState, action) => {
  switch (action.type) {
    case CustomTestQuestion.REQUEST_GET_LIST_CUSTOM_TEST_QUESTION:
      return { ...state, loadingGet: true }
    case CustomTestQuestion.GET_LIST_CUSTOM_TEST_QUESTION:
      return {
        ...state,
        isInitialized: true,
        listCustomTestQuestion: action.payload.listCustomTestQuestion,
        loadingGet: false,
        listCustomTestAnswer: Object.keys(action.payload.listCustomTestQuestion).reduce((pre, cur) => {
          return { ...pre, [parseInt(cur) + 1]: null }
        }, {}),
      }
    case CustomTestQuestion.UPDATE_LIST_CUSTOM_TEST_ANSWER:
      return {
        ...state,
        listCustomTestAnswer: {
          ...state.listCustomTestAnswer,
          ...action.payload,
        },
      }
    case CustomTestQuestion.REQUEST_POST_CUSTOM_TEST_ANSWER:
      return {
        ...state,
        loadingPost: true,
      }
    case CustomTestQuestion.POST_CUSTOM_TEST_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    case CustomTestQuestion.CLEAR_LIST_CUSTOM_TEST_ANSWER:
      return {
        ...state,
        listCustomTestAnswer: {},
        isInitialized: false,
      }
    case CustomTestQuestion.FAIL_REQUEST_POST_CUSTOM_TEST_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    default:
      return state
  }
}

export default customTest
