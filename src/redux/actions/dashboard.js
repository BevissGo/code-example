import { Dashboard } from 'constants/actionTypes'

export const getListCandidates = () => ({
  type: Dashboard.GET_LIST_CANDIDATE,
})

export const getListCandidatesSuccess = (payload) => ({
  type: Dashboard.GET_LIST_CANDIDATE_SUCCESS,
  payload,
})

export const getListCandidatesFailed = () => ({
  type: Dashboard.GET_LIST_CANDIDATE_FAILED,
})

export const getListPositionRecruitment = () => ({
  type: Dashboard.GET_LIST_POSITION,
})

export const getListPositionRecruitmentSuccess = (payload) => ({
  type: Dashboard.GET_LIST_POSITION_SUCCESS,
  payload,
})

export const getListPositionRecruitmentFailed = () => ({
  type: Dashboard.GET_LIST_POSITION_FAILED,
})

export const getNumberOfCandidate = () => ({
  type: Dashboard.GET_NUMBER_OF_CANDIDATE,
})

export const getNumberOfCandidateSuccess = (payload) => ({
  type: Dashboard.GET_NUMBER_OF_CANDIDATE_SUCCESS,
  payload,
})

export const getNumberOfCandidateFailed = () => ({
  type: Dashboard.GET_NUMBER_OF_CANDIDATE_FAILED,
})

export const setFilterDashboard = ({ params, value, key, filterType }) => ({
  type: Dashboard.SET_FILTERS,
  params,
  filterType,
  value,
  key,
})

export const setProfile = (payload) => ({
  type: Dashboard.SET_PROFILE,
  payload,
})

export const getProfilePatterns = (payload) => ({
  type: Dashboard.GET_PROFILE_PATTERNS,
  payload,
})

export const requestChangePassword = () => ({
  type: Dashboard.REQUEST_CHANGE_PASSWORD,
})

export const changePassword = () => ({
  type: Dashboard.CHANGE_PASSWORD,
})

export const failRequestChangePassword = () => ({
  type: Dashboard.FAIL_REQUEST_CHANGE_PASSWORD,
})

export const requestPostEvent = () => ({
  type: Dashboard.REQUEST_POST_EVENT,
})

export const postEvent = () => ({
  type: Dashboard.POST_EVENT,
})

export const failRequestPostEvent = () => ({
  type: Dashboard.FAIL_REQUEST_POST_EVENT,
})

export const requestGetListEvent = (payload) => ({
  type: Dashboard[`REQUEST_GET_LIST_EVENT_${payload}`],
  payload,
})

export const getListEvent = ({ payload, range }) => ({
  type: Dashboard[`GET_LIST_EVENT_${range}`],
  payload,
})

export const failGetListEvent = (payload) => ({
  type: Dashboard[`FAIL_GET_LIST_EVENT_${payload}`],
  payload,
})

export const addTemporaryEvent = (payload) => ({
  type: Dashboard.ADD_TEMPORARY_EVENT,
  payload,
})

export const removeTemporaryEvent = () => ({
  type: Dashboard.REMOVE_TEMPORARY_EVENT,
})

export const requestPostCV = () => ({
  type: Dashboard.REQUEST_POST_CV,
})

export const postCV = (payload) => ({
  type: Dashboard.POST_CV,
  payload,
})

export const failRequestPostCV = () => ({
  type: Dashboard.FAIL_REQUEST_POST_CV,
})

export const clearCV = () => ({
  type: Dashboard.CLEAR_CV,
})

export const getCV = (payload) => ({
  type: Dashboard.GET_CV,
  payload,
})

export const requestGetCV = () => ({
  type: Dashboard.REQUEST_GET_CV,
})

export const failRequestGetCV = () => ({
  type: Dashboard.FAIL_REQUEST_GET_CV,
})

export const getListCV = (payload) => ({
  type: Dashboard.GET_LIST_CV,
  payload,
})

export const requestGetListCV = () => ({
  type: Dashboard.REQUEST_GET_LIST_CV,
})

export const failRequestGetListCV = () => ({
  type: Dashboard.FAIL_REQUEST_GET_LIST_CV,
})
