import { Transaction } from 'constants/actionTypes'

const initialState = {
  loadingCheckout: false,
}

const transaction = (state = initialState, action) => {
  switch (action.type) {
    case Transaction.REQUEST_CHECKOUT_PAYMENT:
      return { ...state, loadingCheckout: true }
    case Transaction.CHECKOUT_PAYMENT:
      return {
        ...state,
        loadingCheckout: false,
      }
    case Transaction.FAIL_REQUEST_TRANSACTION:
      return { ...state, loadingCheckout: false }
    default:
      return state
  }
}

export default transaction
