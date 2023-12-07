import api from 'api'
import { getValueFromStorage } from 'utils'
import { isSuccessResponse } from 'helpers'
import {
  getProfile,
  putProfile,
  requestGetProfile,
  requestPutProfile,
  failRequestProfile,
  putFacebookProfile,
  updateFacebookProfile,
  requestPutFacebookProfile,
  updateProfileInformation,
  updateProfileInformationSuccess,
} from '../actions/profile'
import { logout } from '../services/auth'
import { handleOpenModalFailure } from '../services/modalError'

export const updateFacebookProfileUrl = (facebookProfileUrl) => async (dispatch) => {
  try {
    dispatch(requestPutFacebookProfile())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const body = {
      user: {
        facebookProfileUrl,
      },
    }

    const res = await api.put('/v2/profile/update-facebook-profile-url', body, {
      headers: { Authorization: authHeader },
    })

    dispatch(putFacebookProfile())

    if (isSuccessResponse(res)) {
      dispatch(updateFacebookProfile(facebookProfileUrl))
      return true
    } else {
      dispatch(failRequestProfile(res.data.message))
      return false
    }
  } catch (error) {
    dispatch(failRequestProfile('Something wrong happened...'))
  }
}

export const updateCandidateInformation = (informationValues) => async (dispatch) => {
  try {
    dispatch(updateProfileInformation())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const body = {
      user: informationValues,
    }

    const res = await api.patch('/v2/profile/update-candidate-information', body, {
      headers: { Authorization: authHeader },
    })

    dispatch(putFacebookProfile())

    if (isSuccessResponse(res)) {
      dispatch(updateProfileInformationSuccess(informationValues))
      return true
    } else {
      dispatch(failRequestProfile(res.data.message))
      return false
    }
  } catch (error) {
    dispatch(failRequestProfile('Something wrong happened...'))
  }
}

export const updateProfile = (profile) => async (dispatch) => {
  try {
    dispatch(requestPutProfile())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const body = {
      user: {
        ...profile,
      },
    }

    const res = await api.put('/v2/profile/update-profile', body, {
      headers: { Authorization: authHeader },
    })

    dispatch(putProfile())

    if (isSuccessResponse(res)) {
      // window.location.reload()
      dispatch(updateProfileInformationSuccess(res.data.result.profileUser))
      return true
    } else {
      dispatch(failRequestProfile(res.data.message))
      return false
    }
  } catch (error) {
    dispatch(failRequestProfile('Something wrong happened...'))
    return false
  }
}

export const updateSharedFacebook = () => async (dispatch, getState) => {
  try {
    dispatch(requestPutProfile())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const body = {
      user: {
        ...getState().profile.profile,
        shared_facebook: new Date().toISOString(),
      },
    }

    const res = await api.put('/v2/profile/update-profile', body, {
      headers: { Authorization: authHeader },
    })

    dispatch(putProfile())

    if (isSuccessResponse(res)) {
      // window.location.reload()
      dispatch(updateProfileInformationSuccess(res.data.result.profileUser))
      return true
    } else {
      dispatch(failRequestProfile(res.data.message))
      return false
    }
  } catch (error) {
    dispatch(failRequestProfile('Something wrong happened...'))
    return false
  }
}

const fetchProfile = () => async (dispatch) => {
  try {
    dispatch(requestGetProfile())

    const accessToken = getValueFromStorage('access-token')
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get('/v2/profile', {
      headers: { Authorization: authHeader },
    })

    const payloadFunction = { logOut: () => dispatch(logout()) }

    if (isSuccessResponse(res, payloadFunction)) {
      const { result } = res.data
      const { profileUser, keyCodePremium } = result

      dispatch(getProfile(profileUser, keyCodePremium))
    } else {
      dispatch(failRequestProfile())
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestProfile())
  }
}

const shouldFetchProfile = (state) => {
  const { isInitialized } = state
  return !isInitialized
}

export const fetchProfileIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchProfile(getState().profile)) {
    return dispatch(fetchProfile())
  }
  return true
}
