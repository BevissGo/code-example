import { ModalTimedOut } from 'constants/actionTypes'

const initialState = {
  isVisible: false,
  answerCount: 0,
  questionCount: 0,
  testType: '',
}

const modalTimedOut = (state = initialState, action) => {
  switch (action.type) {
    case ModalTimedOut.OPEN_MODAL_TIMED_OUT:
      return {
        ...state,
        isVisible: true,
        answerCount: action.payload.answerCount,
        questionCount: action.payload.questionCount,
        testType: action.payload.testType,
      }
    case ModalTimedOut.CLOSE_MODAL_TIMED_OUT:
      return { ...state, isVisible: false }
    default:
      return state
  }
}

export default modalTimedOut
