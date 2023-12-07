import jwt_decode from 'jwt-decode'

import config from 'configs'
import api, { affindaAxios } from 'api'
import { getValueFromStorage } from 'utils'
import { generateCVInfo, isSuccessResponse } from 'helpers'
import {
  setProfile,
  setFilterDashboard,
  requestChangePassword,
  failRequestChangePassword,
  getListCandidates,
  getProfilePatterns,
  getNumberOfCandidate,
  getListCandidatesFailed,
  getListCandidatesSuccess,
  getListPositionRecruitment,
  getNumberOfCandidateFailed,
  getNumberOfCandidateSuccess,
  getCV,
  requestGetCV,
  failRequestGetCV,
  getListPositionRecruitmentFailed,
  getListPositionRecruitmentSuccess,
  getListEvent,
  failGetListEvent,
  requestGetListEvent,
  postCV,
  requestPostCV,
  failRequestPostCV,
  requestGetListCV,
  getListCV,
  failRequestGetListCV,
} from 'redux/actions/dashboard'
import { TEMPORARY_EVENT_ID } from 'constants/dashboard'
import { failRequestBusinessPassword } from 'redux/actions/auth'

import { logout } from '../services/auth'
import { handleOpenModalFailure } from './modalError'

export const fetchProfilePatterns = () => async (dispatch) => {
  try {
    const res = await api.get('/v2/business/profile_patterns')
    if (isSuccessResponse(res)) {
      dispatch(getProfilePatterns(res?.data?.result))
    }
  } catch (error) {
    console.log('error: ', error)
  }
}

export const fetchDashBoardCandidate = (valueFilter) => async (dispatch) => {
  try {
    dispatch(
      setFilterDashboard({
        params: valueFilter,
        filterType: 'filtersCandidate',
      }),
    )

    const accessToken = getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
    if (!accessToken) {
      dispatch(fetchDashBoardCandidate(valueFilter))
    }
    const profileInfo = jwt_decode(accessToken)
    dispatch(getListCandidates())
    dispatch(setProfile(profileInfo?.business))

    const res = await api.get('/v2/business/candidate', {
      params: valueFilter,
    })
    if (res?.data?.statusCode === 401) {
      if (localStorage && localStorage.removeItem) {
        localStorage.removeItem(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
        window.location.reload()
      }
    }
    if (isSuccessResponse(res)) {
      dispatch(getListCandidatesSuccess(res?.data?.result))
    } else {
      dispatch(getListCandidatesFailed())
    }
  } catch (error) {
    dispatch(getListCandidatesFailed())
  }
}

export const fetchChartCandidate = (valueFilter) => async (dispatch) => {
  try {
    dispatch(
      setFilterDashboard({
        params: valueFilter,
        filterType: 'filtersNumberOfCandidate',
      }),
    )

    dispatch(getNumberOfCandidate())

    const accessToken = getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
    if (!accessToken) {
      dispatch(fetchChartCandidate())
    }

    const res = await api.get('/v2/business/number-of-candidate', {
      params: valueFilter,
    })

    if (res.data?.statusCode === 401) {
      if (localStorage && localStorage.removeItem) {
        localStorage.removeItem(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
        window.location.reload()
      }
    }
    if (isSuccessResponse(res)) {
      dispatch(getNumberOfCandidateSuccess(res?.data?.result))
    } else {
      dispatch(getNumberOfCandidateFailed())
    }
  } catch (error) {
    dispatch(getNumberOfCandidateFailed())
  }
}

export const fetchDashBoardPositions = (valueFilter) => async (dispatch) => {
  try {
    dispatch(setFilterDashboard({ params: valueFilter, filterType: 'filtersPosition' }))
    dispatch(getListPositionRecruitment())

    const accessToken = getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
    const authHeader = `Bearer ${accessToken}`

    const res = await api.get('/v2/business/position', {
      headers: {
        Authorization: authHeader,
      },
      params: valueFilter,
    })

    if (res?.data?.statusCode === 401) {
      if (localStorage && localStorage.removeItem) {
        localStorage.removeItem(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
        window.location.reload()
      }
    }

    if (isSuccessResponse(res)) {
      dispatch(getListPositionRecruitmentSuccess(res?.data?.result))
    } else {
      dispatch(getListPositionRecruitmentFailed())
    }
  } catch (error) {
    dispatch(getListPositionRecruitmentFailed())
  }
}

export const postPosition = async (value) => {
  try {
    const res = await api.post('/v2/business/position', value)

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    return false
  }
}

export const putPosition = async (id, value) => {
  try {
    const res = await api.put(`/v2/business/position/${id}`, value)

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    return false
  }
}

export const detelePosition = (id, categoryTest, isClosed) => async (dispatch) => {
  try {
    const res = await api.delete(`/v2/business/position/${id}`)

    if (isSuccessResponse(res)) {
      dispatch(fetchDashBoardPositions({ itemPerPage: 10, currentPage: 1, categoryTest, isClosed }))
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    return false
  }
}

export const fetchPositionWithId = async (id) => {
  try {
    const res = await api.get(`/v2/business/position/${id}`)

    if (isSuccessResponse(res)) {
      return res?.data?.result
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

const shouldFetchBusinessProfile = (state) => {
  const { isInitialized } = state
  return !isInitialized
}

export const fetchBusinessProfileIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchBusinessProfile(getState().dashboardReducer)) {
    const accessToken = getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
    if (!accessToken) {
      dispatch(logout())
    }

    const profileInfo = jwt_decode(accessToken)
    return dispatch(setProfile(profileInfo?.business))
  }
  return true
}

export const changePassword = (values) => async (dispatch) => {
  try {
    dispatch(requestChangePassword())
    const body = { business: values }

    const res = await api.post('/v2/business/change-password', body)

    if (isSuccessResponse(res)) {
      dispatch(changePassword())
    } else {
      dispatch(failRequestBusinessPassword)
    }
  } catch (error) {
    dispatch(
      handleOpenModalFailure('notifyError', {
        msg: 'Something wrong happened..',
      }),
    )
    dispatch(failRequestChangePassword())
  }
}

export const addEvent = async (value) => {
  try {
    const { id, eventName, eventDetail, selectedParticipants, dateRange } = value

    const event = {
      title: eventName,
      detail: eventDetail,
      end: dateRange[1].toDate(),
      start: dateRange[0].toDate(),
      participants: selectedParticipants,
    }
    let res = {}

    if (id === TEMPORARY_EVENT_ID) {
      res = await api.post('/v2/business/events', { event })
    } else {
      event.id = id
      res = await api.put(`/v2/business/events/${id}`, { event })
    }

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    return false
  }
}

export const fetchListEvent =
  ({ value, range }) =>
  async (dispatch) => {
    try {
      dispatch(requestGetListEvent(range))
      const res = await api.get('/v2/business/events', {
        params: value,
      })

      if (isSuccessResponse(res)) {
        const formatedListEvent = res.data?.result?.map((event) => ({
          ...event,
          end: new Date(event.end),
          start: new Date(event.start),
        }))
        dispatch(getListEvent({ payload: formatedListEvent ?? [], range }))
        return true
      } else {
        dispatch(failGetListEvent(range))
        return false
      }
    } catch (error) {
      console.log('error: ', error)
      dispatch(failGetListEvent(range))
      return false
    }
  }

export const updateEventStatus = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/v2/business/events/${id}`)

    if (isSuccessResponse(res)) {
      dispatch(getListEvent(res))
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    return false
  }
}

export const deleteEvent = async (id) => {
  try {
    const res = await api.delete(`/v2/business/events/${id}`)

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    return false
  }
}

export const uploadCV = (value) => async (dispatch) => {
  try {
    dispatch(requestPostCV())
    const formData = new FormData()
    formData.append('file', value.file)
    const res = await affindaAxios.post('/resumes', formData)

    if (
      isSuccessResponse({
        data: {
          statusCode: res.status,
          message: res.statusText,
        },
      })
    ) {
      dispatch(postCV(await generateCVInfo(res.data.data)))
      return true
    } else {
      dispatch(failRequestPostCV())
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    dispatch(failRequestPostCV())
    return false
  }
}

export const fetchCV = (id) => async (dispatch) => {
  try {
    dispatch(requestGetCV())
    const res = await api.get(`/v2/business/cv/${id}`)

    if (isSuccessResponse(res)) {
      dispatch(getCV({ ...res.data?.result, id }))
      return true
    } else {
      dispatch(failRequestGetCV())
      return false
    }
  } catch (error) {
    console.log('error: ', error)
    dispatch(failRequestGetCV())
    return false
  }
}

export const fetchListCV = (valueFilter) => async (dispatch) => {
  try {
    dispatch(requestGetListCV())
    const res = await api.get('/v2/business/cv', {
      params: valueFilter,
    })

    if (isSuccessResponse(res) && res?.data?.result) {
      const formattedListCV = res.data.result.map((cv) => ({
        id: cv.id,
        img: cv.avt,
        name: cv.name,
        position: cv.position?.name,
        address: cv.address,
        university: cv.education?.[0].location,
        dob: cv.dob,
        skills: cv.skills?.map((skill) => `${skill}, `),
        avt: cv.avt,
      }))

      dispatch(getListCV(formattedListCV))
      return true
    } else {
      dispatch(failRequestGetListCV())
      return false
    }
  } catch (error) {
    return false
  }
}

export const fetchListEmail = async () => {
  try {
    const res = await api.get('/v2/business/emails')

    if (isSuccessResponse(res)) {
      return res?.data?.result
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}

export const addCV = async ({ cvInfo, positionId }) => {
  try {
    let avt = cvInfo.avt

    if (typeof avt === 'object') {
      const formData = new FormData()
      formData.append('file', cvInfo.avt, `avt-${new Date().getTime()}`)

      const urlRes = await api.post('/v2/business/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (isSuccessResponse(urlRes)) {
        avt = urlRes?.data?.result
      }
    }

    const body = {
      cv: { ...cvInfo, avt, positionId },
    }

    const res = await api.post('/v2/business/cv', body)

    return isSuccessResponse(res)
  } catch (error) {
    return false
  }
}

export const updateCV = async (id, cvInfo) => {
  try {
    let avt = cvInfo.avt

    if (typeof avt === 'object') {
      const formData = new FormData()
      formData.append('file', cvInfo.avt, cvInfo.avt.name)

      const urlRes = await api.post('/v2/business/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (isSuccessResponse(urlRes)) {
        avt = urlRes?.data?.result
      }
    }

    const body = {
      cv: { ...cvInfo, avt },
    }

    const res = await api.put(`/v2/business/cv/${id}`, body)

    return isSuccessResponse(res)
  } catch (error) {
    return false
  }
}

export const deleteCV = async (id) => {
  try {
    const res = await api.delete(`/v2/business/cv/${id}`)
    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const sendEmailToCandidate = async (data) => {
  try {
    const { to } = data
    let listCandidateEmail = []

    to.forEach((email) => {
      if (typeof email !== 'string') {
        listCandidateEmail.push(...email)
      } else {
        listCandidateEmail.push(email)
      }
    })

    const res = await api.post('/v2/business/emails/send', {
      ...data,
      to: listCandidateEmail,
    })

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const fetchListEmailTemplate = async () => {
  try {
    const res = await api.get('/v2/business/emails/template')

    if (isSuccessResponse(res)) {
      return res?.data?.result
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const postEmailTemplate = async (template) => {
  try {
    const res = await api.post('/v2/business/emails/template', { template })

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const putEmailTemplate = async (id, template) => {
  try {
    const res = await api.put(`/v2/business/emails/template/${id}`, { template })

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const deleteEmailTemplate = async (id) => {
  try {
    const res = await api.delete(`/v2/business/emails/template/${id}`)

    if (isSuccessResponse(res)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
