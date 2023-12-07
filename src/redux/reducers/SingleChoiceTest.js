import { SingleChoiceQuestion } from 'constants/actionTypes'

const initialState = {
  listSingleChoiceQuestion: [],
  isInitialized: false,
  loadingGet: false,
  loadingUpdate: false,
  listSingleChoiceAnswer: [],
  loadingPost: false,
}

const SingleChoiceTest = (state = initialState, action) => {
  switch (action.type) {
    case SingleChoiceQuestion.GET_LIST_SINGLE_CHOICE_QUESTION:
      return {
        ...state,
        isInitialized: true,
        listSingleChoiceQuestion: action.payload.listSingleChoiceQuestion,
        loadingGet: false,
        listSingleChoiceAnswer: Object.keys(action.payload.listSingleChoiceQuestion).reduce(
          (pre, cur) => ({ ...pre, [parseInt(cur) + 1]: null }),
          {},
        ),
      }
    case SingleChoiceQuestion.FAIL_REQUEST_SINGLE_CHOICE_QUESTION:
      return {
        ...state,
        loadingPost: false,
      }
    case SingleChoiceQuestion.UPDATE_LIST_SINGLE_CHOICE_ANSWER:
      return {
        ...state,
        listSingleChoiceAnswer: {
          ...state.listSingleChoiceAnswer,
          ...action.payload,
        },
      }
    case SingleChoiceQuestion.REQUEST_POST_SINGLE_CHOICE_ANSWER:
      return {
        ...state,
        loadingPost: true,
      }
    case SingleChoiceQuestion.POST_SINGLE_CHOICE_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    case SingleChoiceQuestion.CLEAR_LIST_SINGLE_CHOICE_ANSWER:
      return {
        ...state,
        listSingleChoiceAnswer: {},
        isInitialized: false,
      }
    case SingleChoiceQuestion.FAIL_REQUEST_POST_SINGLE_CHOICE_ANSWER:
      return {
        ...state,
        loadingPost: false,
      }
    default:
      return state
  }
}

export default SingleChoiceTest
