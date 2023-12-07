import { Profile } from 'constants/actionTypes'

const initialState = {
  profile: {},
  keyCode: '',
  isInitialized: false,
  loadingGet: false,
  loadingPut: false,
}

const profile = (state = initialState, action) => {
  switch (action.type) {
    case Profile.REQUEST_GET_PROFILE:
      return { ...state, loadingGet: true }
    case Profile.GET_PROFILE:
      return {
        ...state,
        loadingGet: false,
        isInitialized: true,
        profile: { ...action.payload.infoUser },
        keyCode: action.payload.keyCode || '',
      }
    case Profile.CHECKOUT_PAYMENT:
      return {
        ...state,
        isInitialized: false,
        // profile: {
        //   ...state.profile,
        //   type_user: 'PREMIUM',
        // },
      }
    case Profile.FAIL_REQUEST_PROFILE:
      return { ...state, loadingGet: false }
    case Profile.REQUEST_PUT_FB_PROFILE:
      return { ...state, loadingPut: true }
    case Profile.UPDATE_PROFILE_INFORMATION:
      return { ...state, loadingPut: false }
    case Profile.UPDATE_PROFILE_INFORMATION_SUCCESS:
      return {
        ...state,
        profile: { ...state.profile, ...action.informationValues },
      }
    case Profile.PUT_FB_PROFILE:
      return { ...state, loadingPut: false }
    case Profile.UPDATE_FB_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, facebook_profile_url: action.facebookProfileUrl },
      }
    case Profile.REQUEST_PUT_PROFILE:
      return { ...state, loadingPut: true }
    case Profile.PUT_PROFILE:
      return { ...state, loadingPut: false }
    default:
      return state
  }
}

export default profile
