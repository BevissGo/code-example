import moment from 'moment'

import { Dashboard } from 'constants/actionTypes'
import { ITEM_PER_PAGE } from 'constants/options'

const initialState = {
  profileInfo: {},
  isInitialized: false,
  isFetching: false,
  isFetched: false,
  candidates: [],
  positionRecruiment: [],
  numberOfCandidate: {},
  profilePatterns: [],
  filtersCandidate: {
    currentPage: 1,
    itemPerPage: ITEM_PER_PAGE,
    filter: '',
    profilePattern: [],
  },
  filtersPosition: {
    currentPage: 1,
    itemPerPage: ITEM_PER_PAGE,
  },
  filtersNumberOfCandidate: {
    periodStart: '',
    periodEnd: '',
  },
  loadingChangePassword: false,
  eventsByMonth: [],
  eventsByWeek: [],
  cvInfo: {},
  filtersEvent: {
    startDate: moment().startOf('month').clone().toDate(),
    endDate: moment().endOf('month').clone().toDate(),
  },
  curriculumVitaes: [],
}

const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case Dashboard.GET_LIST_CANDIDATE:
      return { ...state, isFetching: true }
    case Dashboard.GET_LIST_CANDIDATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        candidates: action.payload,
      }
    case Dashboard.GET_LIST_CANDIDATE_FAILED:
      return { ...state, isFetching: false, isFetched: true, candidates: [] }
    case Dashboard.GET_LIST_POSITION:
      return { ...state, isFetching: true }
    case Dashboard.GET_LIST_POSITION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        positionRecruiment: action.payload,
      }
    case Dashboard.GET_LIST_POSITION_FAILED:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        positionRecruiment: [],
      }
    case Dashboard.GET_NUMBER_OF_CANDIDATE:
      return { ...state }
    case Dashboard.GET_NUMBER_OF_CANDIDATE_SUCCESS:
      return { ...state, numberOfCandidate: action.payload }
    case Dashboard.GET_NUMBER_OF_CANDIDATE_FAILED:
      return { ...state }
    case Dashboard.SET_PROFILE:
      return { ...state, profileInfo: action.payload }
    case Dashboard.GET_PROFILE_PATTERNS:
      return { ...state, profilePatterns: action.payload }
    case Dashboard.SET_FILTERS:
      return {
        ...state,
        [action.filterType]: {
          ...state[action.filterType],
          ...action.params,
          [action.key]: {
            ...action.value,
          },
        },
      }
    case Dashboard.REQUEST_CHANGE_PASSWORD:
      return { ...state, loadingChangePassword: true }
    case Dashboard.CHANGE_PASSWORD:
      return { ...state, loadingChangePassword: false }
    case Dashboard.FAIL_REQUEST_CHANGE_PASSWORD:
      return { ...state, loadingChangePassword: false }
    case Dashboard.REQUEST_GET_LIST_EVENT_BY_MONTH:
      return { ...state, isFetching: true }
    case Dashboard.GET_LIST_EVENT_BY_MONTH:
      return { ...state, isFetching: false, eventsByMonth: action.payload }
    case Dashboard.FAIL_GET_LIST_EVENT_BY_MONTH:
      return { ...state, isFetching: false, eventsByMonth: [] }
    case Dashboard.REQUEST_GET_LIST_EVENT_BY_WEEK:
      return { ...state, isFetching: true }
    case Dashboard.GET_LIST_EVENT_BY_WEEK:
      return { ...state, isFetching: false, eventsByWeek: action.payload }
    case Dashboard.FAIL_GET_LIST_EVENT_BY_WEEK:
      return { ...state, isFetching: false, eventsByWeek: [] }
    case Dashboard.ADD_TEMPORARY_EVENT:
      return { ...state, eventsByWeek: [...state.eventsByWeek, action.payload] }
    case Dashboard.REMOVE_TEMPORARY_EVENT:
      state.eventsByWeek.pop()
      return { ...state }
    case Dashboard.REQUEST_POST_CV:
      return { ...state, isFetching: true }
    case Dashboard.POST_CV:
      return { ...state, isFetching: false, cvInfo: action.payload }
    case Dashboard.FAIL_REQUEST_POST_CV:
      return { ...state, isFetching: false, cvInfo: {} }
    case Dashboard.CLEAR_CV:
      return { ...state, cvInfo: {} }
    case Dashboard.REQUEST_GET_CV:
      return { ...state, isFetching: true }
    case Dashboard.GET_CV:
      return { ...state, isFetching: false, cvInfo: action.payload }
    case Dashboard.FAIL_REQUEST_GET_CV:
      return { ...state, isFetching: false, cvInfo: {} }
    case Dashboard.REQUEST_GET_LIST_CV:
      return { ...state, isFetching: true }
    case Dashboard.GET_LIST_CV:
      return { ...state, isFetching: false, curriculumVitaes: action.payload }
    case Dashboard.FAIL_REQUEST_GET_LIST_CV:
      return { ...state, isFetching: false, curriculumVitaes: [] }
    default:
      return state
  }
}

export default DashboardReducer
