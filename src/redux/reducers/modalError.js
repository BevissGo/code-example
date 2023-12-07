import { ModalError } from 'constants/actionTypes'

const initialState = {
  isVisible: false,
  errors: '',
  type: '',
}

const modalError = (state = initialState, action) => {
  switch (action.type) {
    case ModalError.OPEN_MODAL_ERROR:
      return {
        ...state,
        isVisible: true,
        errors: action.payload.errors,
        type: action.payload.type,
      }
    case ModalError.CLOSE_MODAL_ERROR:
      return { ...state, isVisible: false, errors: '', type: '' }
    default:
      return state
  }
}

export default modalError
