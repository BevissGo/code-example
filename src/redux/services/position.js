import { isSuccessResponse } from 'helpers'
import { getValueFromStorage, redirectToWithReplace } from 'utils'
import api from 'api'

export const fetchPosition = async (positionId, setPosition, history, testId) => {
  const accessToken = getValueFromStorage('access-token')
  const authHeader = `Bearer ${accessToken}`

  const res = await api.get(`/v2/position/${positionId}`, {
    headers: { Authorization: authHeader },
    params: { testId },
  })

  if (isSuccessResponse(res)) {
    const { result } = res.data

    setPosition(result)
  } else {
    redirectToWithReplace(history, '/')
  }
}
