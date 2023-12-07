import { openModalError, closeModalError } from '../actions/modalError'

export const handleOpenModalFailure = (type, errors) => (dispatch) => {
  dispatch(openModalError(type, errors))
}

export const handleCloseModalFailure = () => (dispatch) => {
  dispatch(closeModalError())
}
