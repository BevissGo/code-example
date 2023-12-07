import { LRBrainQuestion } from 'constants/actionTypes'
// import { renewListGroupQuestion } from 'helpers'

const initialState = {
  listLRBrainQuestion: {},
  isInitialized: false,
  loadingGet: false,
  loadingUpdate: false,
  listAnswer: [],
  loadingPost: false,
}

const brainTest = (state = initialState, action) => {
  switch (action.type) {
    case LRBrainQuestion.REQUEST_GET_LIST_LR_BRAIN_QUESTION:
      return { ...state, loadingGet: true }
    case LRBrainQuestion.GET_LIST_LR_BRAIN_QUESTION:
      return {
        ...state,
        isInitialized: true,
        listLRBrainQuestion: action.payload.listLRBrainQuestion,
        loadingGet: false,
        listAnswer: Object.keys(action.payload.listLRBrainQuestion).reduce(
          (pre, cur) => ({ ...pre, [parseInt(cur) + 1]: null }),
          {}
        ),
      }
    case LRBrainQuestion.UPDATE_LIST_LR_BRAIN_ANSWER:
      return {
        ...state,
        listAnswer: {
          ...state.listAnswer,
          ...action.payload,
        },
      }
    case LRBrainQuestion.REQUEST_POST_BRAIN_ANSWER:
      return {
        ...state,
        loadingPost: true,
      }
    case LRBrainQuestion.POST_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    case LRBrainQuestion.CLEAR_LIST_BRAIN_ANSWER:
      return {
        ...state,
        listAnswer: {},
        isInitialized: false,
      }
    case LRBrainQuestion.FAIL_REQUEST_POST_BRAIN_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    default:
      return state
  }
}

export default brainTest
