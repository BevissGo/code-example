import { ModalTimedOut } from 'constants/actionTypes'

export const openModalTimedOut = (answerCount, questionCount, testType) => ({
  type: ModalTimedOut.OPEN_MODAL_TIMED_OUT,
  payload: {
    answerCount,
    questionCount,
    testType,
  },
})

export const closeModalTimedOut = () => ({
  type: ModalTimedOut.CLOSE_MODAL_TIMED_OUT,
})
