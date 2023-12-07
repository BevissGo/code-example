import { IQTest } from 'constants/actionTypes'
import { iqTestPage } from '../../constants/images'

const initListAnswer = Object.keys(iqTestPage.listResult).reduce(
  (pre, cur)=> ({...pre, [cur]: null}), {}
) // [ {1: null}, {2: null}, ..., {25: null} ] with number of IQ questions is 25

const initialState = {
  listAnswer: initListAnswer,
  loadingPost: false,
}

const IQTestAnswer = (state = initialState, action) => {
  switch (action.type) {
    case IQTest.UPDATE_LIST_ANSWER: {
      return {
        ...state,
        listAnswer: {
          ...state.listAnswer,
          ...action.payload // Ex: action.payload = {1: 'a'}
        }
      }
    }
    case IQTest.REQUEST_POST_ANSWER:
      return {
        ...state,
        loadingPost: true
      }
    case IQTest.POST_ANSWER:
      return {
        ...state,
        // listAnswer: {},
        loadingPost: false
      }
    case IQTest.FAIL_REQUEST_POST_ANSWER:
      return {
        ...state,
        loadingPost: false
      }
    case IQTest.CLEAR_LIST_ANSWER:
      return {
        ...state,
        listAnswer: initListAnswer
      }
    default:
      return state
  }
}

export default IQTestAnswer
