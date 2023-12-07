import { Transaction } from 'constants/actionTypes'

export const requestCheckoutPayment = () => ({
  type: Transaction.REQUEST_CHECKOUT_PAYMENT,
})

export const checkoutPayment = () => ({
  type: Transaction.CHECKOUT_PAYMENT,
})

export const failRequestTransaction = () => ({
  type: Transaction.FAIL_REQUEST_TRANSACTION,
})
