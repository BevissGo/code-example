import api from 'api'
import config from 'configs'
import { isSuccessResponse } from 'helpers'
import { setValueToStorage, clearStorage } from 'utils'
import {
  authLogin,
  authLogout,
  businessLogin,
  failRequestAuth,
  requestAuthLogin,
  requestBusinessLogin,
  businessResetPassword,
  failRequestBusinessPassword,
  requestBusinessResetPassword,
} from '../actions/auth'
import { handleOpenModalFailure } from '../services/modalError'

export const loginWithFacebook = (email, name, picture, userID) => async (dispatch) => {
  try {
    dispatch(requestAuthLogin())

    const body = {
      email,
      name,
      avatar: picture.data.url,
      userId: userID,
    }

    const res = await api.post('/v2/auth/login-with-facebook', body)

    if (isSuccessResponse(res)) {
      const { result } = res.data
      const { accessToken } = result

      setValueToStorage('access-token', accessToken)
      dispatch(authLogin())
    } else {
      dispatch(failRequestAuth())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestAuth())
  }
}

export const loginWithLinkedin = (code) => async (dispatch) => {
  try {
    dispatch(requestAuthLogin())

    const body = {
      code,
    }

    const res = await api.post('/v2/auth/login-with-linkedin', body)

    if (isSuccessResponse(res)) {
      const { result } = res.data
      const { accessToken } = result

      setValueToStorage('access-token', accessToken)
      dispatch(authLogin())
    } else {
      dispatch(failRequestAuth())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestAuth())
  }
}

export const signUpBusiness = (business, handleShowModal) => async (dispatch) => {
  try {
    dispatch(requestBusinessLogin())

    const body = { business }

    const res = await api.post('/v2/business/sign-up', body)

    if (isSuccessResponse(res)) {
      handleShowModal()
    } else {
      dispatch(failRequestAuth())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestAuth())
  }
}

export const signInBusiness = (business) => async (dispatch) => {
  try {
    dispatch(requestBusinessLogin())

    const body = { business }

    const res = await api.post('/v2/business/sign-in', body)

    if (isSuccessResponse(res)) {
      const { result } = res.data
      const { accessToken } = result

      setValueToStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY, accessToken)
      setValueToStorage(config.authentication.AFFINDA_API_KEY, process.env.REACT_APP_AFFINDA_API_KEY)
      dispatch(businessLogin())
    } else {
      dispatch(failRequestAuth())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestAuth())
  }
}

export const resetPasswordBusiness = (email, handleShowCheckEmailModal) => async (dispatch) => {
  try {
    dispatch(requestBusinessResetPassword())

    const body = { business: { email: email } }

    const res = await api.post('/v2/business/reset-password', body)

    if (isSuccessResponse(res)) {
      dispatch(businessResetPassword())
      handleShowCheckEmailModal()
    } else {
      dispatch(failRequestBusinessPassword())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestBusinessPassword())
  }
}

export const loginWithToken = (token) => async (dispatch) => {
  try {
    dispatch(requestAuthLogin())

    if (token) {
      setValueToStorage('access-token', token)
      dispatch(authLogin())
    } else {
      dispatch(failRequestAuth())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestAuth())
  }
}

export const logout = () => async (dispatch) => {
  dispatch(authLogout())
  clearStorage()
}

export const loginWithGoogle = (idToken) => async (dispatch) => {
  try {
    dispatch(requestAuthLogin())

    const body = {
      idToken,
    }

    const res = await api.post('/v2/auth/login-with-google', body)

    if (isSuccessResponse(res)) {
      const { result } = res.data
      const { accessToken } = result

      setValueToStorage('access-token', accessToken)
      dispatch(authLogin())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestAuth())
  }
}
