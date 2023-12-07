import { Profile } from 'constants/actionTypes'

export const requestGetProfile = () => ({
  type: Profile.REQUEST_GET_PROFILE,
})

export const getProfile = (infoUser, keyCode) => ({
  type: Profile.GET_PROFILE,
  payload: { infoUser, keyCode },
})

export const failRequestProfile = () => ({
  type: Profile.FAIL_REQUEST_PROFILE,
})

export const updateProfileInformation = () => ({
  type: Profile.UPDATE_PROFILE_INFORMATION,
})

export const updateProfileInformationSuccess = (informationValues) => ({
  type: Profile.UPDATE_PROFILE_INFORMATION_SUCCESS,
  informationValues,
})

export const requestPutFacebookProfile = () => ({
  type: Profile.REQUEST_PUT_FB_PROFILE,
})

export const putFacebookProfile = () => ({
  type: Profile.PUT_FB_PROFILE,
})

export const updateFacebookProfile = (fbProfileUrl) => ({
  type: Profile.UPDATE_FB_PROFILE,
  facebookProfileUrl: fbProfileUrl,
})

export const requestPutProfile = () => ({
  type: Profile.REQUEST_PUT_PROFILE,
})

export const putProfile = () => ({
  type: Profile.PUT_PROFILE,
})
