import { openModalTimedOut, closeModalTimedOut } from '../actions/modalTimedOut'

export const handleOpenModalTimedOut = (answerCount, questionCount, testType) => (dispatch) => {
  dispatch(openModalTimedOut(answerCount, questionCount, testType))
}

export const handleCloseModalTimedOut = () => (dispatch) => {
  dispatch(closeModalTimedOut())
}
