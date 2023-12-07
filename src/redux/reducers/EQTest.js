import { EQQuestion } from 'constants/actionTypes'

const initialState = {
  listEQQuestion: {},
  isInitialized: false,
  loadingGet: false,
  loadingUpdate: false,
  listEQAnswer: [],
  loadingPost: false,
}

const EQTest = (state = initialState, action) => {
  switch (action.type) {
    case EQQuestion.REQUEST_GET_LIST_EQ_QUESTION:
      return { ...state, loadingGet: true }
    case EQQuestion.GET_LIST_EQ_QUESTION:
      return {
        ...state,
        isInitialized: true,
        listEQQuestion: action.payload.listEQQuestion,
        loadingGet: false,
        listEQAnswer: Object.keys(action.payload.listEQQuestion).reduce((pre, cur) => {
          return { ...pre, [parseInt(cur) + 1]: null }
        }, {}),
      }
    case EQQuestion.UPDATE_LIST_EQ_ANSWER:
      return {
        ...state,
        listEQAnswer: {
          ...state.listEQAnswer,
          ...action.payload,
        },
      }
    case EQQuestion.REQUEST_POST_EQ_ANSWER:
      return {
        ...state,
        loadingPost: true,
      }
    case EQQuestion.POST_EQ_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    case EQQuestion.CLEAR_LIST_EQ_ANSWER:
      return {
        ...state,
        listEQAnswer: {},
        isInitialized: false,
      }
    case EQQuestion.FAIL_REQUEST_POST_EQ_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    default:
      return state
  }
}

export default EQTest
