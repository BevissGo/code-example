import { ModalError } from 'constants/actionTypes'

export const openModalError = (type, errors) => ({
  type: ModalError.OPEN_MODAL_ERROR,
  payload: {
    type,
    errors,
  },
})

export const closeModalError = () => ({
  type: ModalError.CLOSE_MODAL_ERROR,
})
