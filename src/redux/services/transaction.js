import api from 'api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse, toastifyNotify } from 'helpers'
import {
  checkoutPayment,
  requestCheckoutPayment,
  failRequestTransaction,
} from '../actions/transaction'
import { handleOpenModalFailure } from '../services/modalError'

export const checkOut = (
  paymentInfo,
  idPaymentMethod,
  redirectToSuccess
) => async (dispatch) => {
  try {
    dispatch(requestCheckoutPayment())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const { billInformation, paymentSummary } = paymentInfo

    const body = {
      billInformation,
      paymentSummary,
      idPaymentMethod,
    }

    const res = await api.post('/v2/transaction/checkout', body, {
      headers: { Authorization: authHeader },
    })
    if (isSuccessResponse(res)) {
      toastifyNotify('success', 'Paid bill successfully!!!')

      redirectToSuccess()
      dispatch(checkoutPayment())
    } else {
      dispatch(failRequestTransaction())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      })
    )
    dispatch(failRequestTransaction())
  }
}
