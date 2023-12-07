import { GroupQuestion } from 'constants/actionTypes'
import { renewListGroupQuestion } from 'helpers'

const initialState = {
  listGroupQuestion: {},
  isInitialized: false,
  loadingGet: false,
  loadingUpdate: false,
}

const groupQuestion = (state = initialState, action) => {
  switch (action.type) {
    case GroupQuestion.REQUEST_GET_LIST_GROUP_QUESTION:
      return { ...state, loadingGet: true }
    case GroupQuestion.GET_LIST_GROUP_QUESTION:
      return {
        ...state,
        isInitialized: true,
        listGroupQuestion: action.payload.listGroupQuestion,
        loadingGet: false,
      }
    case GroupQuestion.REQUEST_UPDATE_LIST_GROUP_QUESTION:
      return { ...state, loadingUpdate: true }
    case GroupQuestion.UPDATE_LIST_GROUP_QUESTION: {
      const { keyIdGroupQuestion, dataAnswer } = action.payload

      const currentListGroupQuestion = state.listGroupQuestion

      currentListGroupQuestion[keyIdGroupQuestion].answer[
        dataAnswer.typeAnswer
      ].keyIdQuestion = dataAnswer.keyIdQuestion

      return {
        ...state,
        loadingUpdate: false,
      }
    }
    case GroupQuestion.POST_LIST_GROUP_QUESTION:
      return { ...state }
    case GroupQuestion.POST_REPORT:
      return {
        ...state,
        listGroupQuestion: renewListGroupQuestion(state.listGroupQuestion),
      }
    case GroupQuestion.FAIL_REQUEST_GROUP_QUESTION:
      return { ...state, loadingGet: false, loadingUpdate: false }
    case GroupQuestion.CLEAR_LIST_ANSWER_REPORT: {
      const currentListGroupQuestion = Object.values(state.listGroupQuestion)

      currentListGroupQuestion.forEach((question) => {
        delete question.answer.most.keyIdQuestion
        delete question.answer.least.keyIdQuestion
      })

      return { ...state }
    }
    default:
      return state
  }
}

export default groupQuestion
