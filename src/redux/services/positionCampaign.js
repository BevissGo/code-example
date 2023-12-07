import api from 'api'
import { isSuccessResponse } from 'helpers'
import { getValueFromStorage, redirectToWithReplace } from 'utils'

export const fetchPositionCampaign = async (
  dispatch,
  campaignId,
  positionId,
  testId,
  setPosition,
  setLoading,
  history,
) => {
  const accessToken = getValueFromStorage('access-token')
  const authHeader = `Bearer ${accessToken}`

  setLoading(true)

  const res = await api.get(`/v2/position-campaign/${campaignId}/${positionId}`, {
    headers: { Authorization: authHeader },
    params: { testId },
  })

  if (isSuccessResponse(res)) {
    setLoading(false)
    const { result } = res?.data
    setPosition(result)
  } else {
    setLoading(false)
    redirectToWithReplace(history, '/')
  }
}
